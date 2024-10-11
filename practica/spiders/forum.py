import scrapy
from practica.items import MessageItem


class ForumSpider(scrapy.Spider):
    name = "forum"

    start_urls = [
        "https://forums.debian.net/viewtopic.php?t=159210"
    ]

    def parse(self, response):
        for m in response.css("div.post"):
            message = MessageItem()
            message['link'] = m.css('h3>a::attr(href)').get()
            message['date'] = m.css('time::attr(datetime)').get()
            message['content'] = m.css('div.content::text').get()
            message['author'] = m.css('a.username::text').get()
            yield message
        next_page = response.css('a[rel="next"]::attr(href)').get()
        if next_page is not None:
            next_page = response.urljoin(next_page)
            yield scrapy.Request(next_page, callback=self.parse)
