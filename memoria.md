# Práctica RIWS

# Contribuyentes

- Juan Villaverde Rodríguez: juan.villaverde.rodriguez@udc.es



## Búsqueda del dominio y crawling web

Para el dominio de búsqueda se escogió la página [www.planetadelibros.com]. Esto es una tienda de libros, parte del Grupo Planeta. En esta página lo que se hará será buscar los libros entre todas las categorías y convertirlos a JSON para la búsqueda con Elastic. Partiendo de [https://www.planetadelibros.com/libros] se va pasando de categoría en categoría, y en cada categoría cogiendo todos los libros que aparecen en cada página de la categoría. De los libros se extraen el enlace al libro, título, autor, descripción, categoría, ISBN y fecha de publicación.

## Desarrollo del proyecto

Primero se implementó la parte del _crawler_. Para empezar, tuvimos que decidir qué campos escojer. Una vez hecho eso, e indicados en la clase items.BookItem, se implementó el _crawler_ en sí. Primero se creó la función `parse_book`, que extrae un `BookItem` de la página de un libro. Después se creó `parseTematica`, que se encarga de extraer las URL de las páginas de la categoría (saltando los enlaces que no sean libros o que ya se visitaran), y ejecutando en bucle `parse_book`. Para terminar, la función `parse` se encarga de ejecutar `parse_book` saltando de categoría en categoría.

El _crawler_ le pasa la lista de `BookItem` a una _pipeline_ que lo serializa a JSON y lo guarda en un archivo `output.json`.

Este archivo JSON después se introduce en ElasticSearch usando el código de `elastic/create.py`, que descifra el JSON y lo introduce en un índice.

La interfaz web en Typescript se conecta a la instancia de ElasticSearch para permitir buscar. A partir del código de ejemplo, se ha modificado para darle un mejor aspecto a la búsqueda.

## Funcionalides implementadas
### Configuración inicial

Para el desarrollo del frontend hemos partido de la base de la App Starter de Search UI. Para ello, primero ha sido necesario descargarla en la carpeta del proyecto desde GitHub mediante el comando

`curl https://codeload.github.com/elasticapp-search-reference-ui-react/tar.gz/master |tar -xz`

Para configurarla, desde la carpeta descargada, se instalaron las dependencias mediante el comando `yarn` y posteriormente la libreria para conectarse con Elasticsearch, mediante 
`yarn add @elastic/search-ui-elasticsearch-connector`

Una vez todas las dependencias fueron instaladas



## Tecnologías usadas

Para la parte del _crawler_ se usa Python y Scrapy. De aquí se saca un archivo en JSON que se le pasa a Elastic, basado en Java. La interfaz web está escrita en Typescript. La interface y Elastic se levantan con Docker.

