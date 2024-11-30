# Búsqueda en Planeta de Libros

## Búsqueda del dominio y crawling web

Para el dominio de búsqueda se escogió la página [www.planetadelibros.com]. Esto es una tienda de libros, parte del Grupo Planeta. En esta página lo que se hará será buscar los libros entre todas las categorías y convertirlos a JSON para la búsqueda con Elastic. Partiendo de [https://www.planetadelibros.com/libros] se va pasando de categoría en categoría, y en cada categoría cogiendo todos los libros que aparecen en cada página de la categoría. De los libros se extraen el enlace al libro, título, autor, descripción, categoría, ISBN y fecha de publicación.

## Desarrollo del proyecto

Primero se implementó la parte del _crawler_. El crawler recorre los libros de cada categoría, extrayendo los datos y pasándolos a un objeto items.BookItem; después una _pipeline_ lo serializa a JSON.

Este archivo JSON después se introduce en ElasticSearch. Una interfaz web en Typescript se conecta a la instancia de ElasticSearch para permitir buscar.

## Tecnologías usadas

Para la parte del _crawler_ se usa Python y Scrapy. De aquí se saca un archivo en JSON que se le pasa a Elastic, basado en Java. La interfaz web está escrita en Typescript. La interface y Elastic se levantan con Docker.
