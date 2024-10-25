import scrapy
from practica.items import BookItem
import re


class PlanetaSpider(scrapy.Spider):
    name = "planeta"

    start_urls = [
        "https://www.casadellibro.com/"
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
        return book

    def parse(self, response):
        match_book_url = re.compile("^/libro.*")
        for book in response.css("a::attr(href)"):
            url = book.get()
            if match_book_url.match(url) is not None:
                next_page = response.urljoin(url)
                page = scrapy.Request(next_page, callback=self.parse_book)
                if page is None:
                    yield scrapy.Request(next_page, callback=self.parse)
                else:
                    yield page
