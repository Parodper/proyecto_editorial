# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class BookItem(scrapy.Item):
    link = scrapy.Field()
    title = scrapy.Field()
    author = scrapy.Field()
    synopsis = scrapy.Field()
    category = scrapy.Field()
    isbn = scrapy.Field()
    publication_date = scrapy.Field()
    image = scrapy.Field()
