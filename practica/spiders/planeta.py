import scrapy
from practica.items import BookItem
import re


class PlanetaSpider(scrapy.Spider):
    name = "planeta"

    start_urls = [
        "https://www.casadellibro.com/"
    ]

    def parse_book(self, response) -> BookItem:
        book = BookItem()
        book['title'] = response.css(".titleProducto::text()")
        book['link'] = response.url
        book['author'] = response.xpath('//meta[@property="book:author"]/@content').get()
        book['synopsis'] = response.css(".resumen-content::text").get()
        book['category'] = [x.get().strip() for x in response.css(".breadcrumbs").css("li").css("a::text")][1:]
        book['isbn'] = response.xpath('//meta[@property="book:isbn"]/@content').get()
        book['publication_date'] = response.xpath('//meta[@property="book:release_date"]/@content').get()

    def parse(self, response):
        match_book_url = re.compile("^/libro.*")

        for book in response.css("a::attr(href)"):
            url = book.get()
            if match_book_url.match(url) is not None:
                next_page = response.urljoin(url)
                yield scrapy.Request(next_page, callback=self.parse)

