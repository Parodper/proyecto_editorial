import scrapy
from practica.items import BookItem

class PlanetaSpider(scrapy.Spider):
    name = "planeta"
    BASE_URL = "https://www.casadellibro.com"

    start_urls = [
        "https://www.casadellibro.com/libros"
    ]
    
    def parse(self, response):
        for themeREF in response.css("div.tematicas a.accent-text::attr(href)").getall():
            themeURL = response.urljoin(themeREF)
            yield scrapy.Request(
                url=themeURL,
                callback=self.parseTematica
            )
            
    def parseTematica(self, response):
        for bookRef in response.css("div.results div.products a::attr(href)").getall():
            if not bookRef.startswith("/libro-") or bookRef.endswith("?panel=PanelFormatos"):
                continue
            
            next_page = self.BASE_URL + bookRef
            yield scrapy.Request(
                url=next_page,
                callback=self.parse_book
            )

    def parse_book(self, response):
        book = BookItem()
        book['title'] = response.css(".titleProducto::text").get()
        book['link'] = response.url
        book['author'] = response.xpath('//meta[@property="book:author"]/@content').get()
        book['synopsis'] = '\n'.join(response.css(".resumen-content *::text").getall())
        book['category'] = [x.get().strip() for x in response.css(".breadcrumbs li a::text")][1:]
        book['isbn'] = response.xpath('//meta[@property="book:isbn"]/@content').get()
        book['publication_date'] = response.xpath('//meta[@property="book:release_date"]/@content').get()
        book['image'] = response.xpath('//meta[@property="og:image"]/@content').get()
        
        yield book
