import scrapy
from practica.items import BookItem
import re


class PlanetaSpider(scrapy.Spider):
    name = "planeta"
    BASE_URL = "https://www.casadellibro.com"
    lastURL = ""
        
    start_urls = [
        "https://www.casadellibro.com/libros"
    ]

    def parse_book(self, response) -> BookItem:
        response = response.replace(body=response.body.decode('utf-8'))
        isbn = response.xpath('//meta[@property="book:isbn"]/@content').get()
        if isbn is None:
            return None
        book = BookItem()
        book['title'] = response.css(".titleProducto::text").get()
        book['link'] = response.url
        book['author'] = response.xpath('//meta[@property="book:author"]/@content').get()
        book['synopsis'] = '\n'.join(response.css(".resumen-content *::text").getall())
        book['category'] = [x.get().strip() for x in response.css(".breadcrumbs").css("li").css("a::text")][1:]
        book['isbn'] = isbn
        book['publication_date'] = response.xpath('//meta[@property="book:release_date"]/@content').get()

        # Aquí devolvemos el item
        yield book

    def bookWasSeen(self, url):
        if self.lastURL == url:
            return True
        else:
            self.lastURL = url
            return False

    def isABook(self, url):
        return url.startswith("/libro-") and not url.endswith("PanelFormatos")

    def parseTematica(self, tematicaURL):
        print(tematicaURL)
        for bookRef in tematicaURL.css("div.results").css("div.products").css("a::attr(href)").getall():
            print(bookRef)

            if (not self.isABook(bookRef) or self.bookWasSeen(bookRef)):
                continue

            next_page = self.BASE_URL + bookRef
            page = scrapy.Request(next_page, callback=self.parse_book)
            if page is None:
                yield scrapy.Request(next_page, callback=self.parse)
            else:
                yield page

    def parse(self, response):
        startsIn = 6
        counter = 0
        for themeREF in response.css("div.tematicas").css("a.accent-text::attr(href)").getall():
            if (counter < startsIn):
                counter = counter + 1
                continue

            #print(themeREF)
            themeURL = response.urljoin(themeREF)
            #self.parseTematica(themeREF)
            yield scrapy.Request(themeURL, callback=self.parseTematica)


# Tematica string: response.css("div.tematicas").css("a.accent-text::text").getall()
# response.css("div.results").css("div.products").css("a::attr(href)")[8].get()

# Memoria
# Tecnologias usadas (Python elastic...)
# Crawling que es, que se crawleo
# Web: Como se ve
# Funcionalidades
# Alguna captura
# Sencillo todo
# Casos de uso