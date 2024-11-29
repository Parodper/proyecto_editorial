# Práctica 1 de RIWS

## Lanzar o Scrapy

1. Crear un venv: Depende do sistema operativo, en UNIX con `python -mvenv .`
2. Hacer `pip install scrapy`
3. Dende a carpeta de **proyecto_editorial** executar scrapy: `scrapy crawl planeta`.

Isto xera un ficheiro output.json (está dispoñible unha versión de exemplo en **proyecto_editorial/practica/data**). Este ficheiro cópiase ao cartafol  **proyecto_editorial/elastic**.´

## Lanzar Elastic

Para lanzar elastic hai que lanzar o Docker compose definido en  **proyecto_editorial/elastic.yml**. En sistemas UNIX faise dende  **proyecto_editorial** con `docker compose -f elastic.yml up`. Unha vez iniciado, dende outra terminal, entrase no mesmo venv da parte de Scrapy e faise `pip install elasticsearch`. Tras isto execútase (dende **proyecto_editorial/elastic**) o programa **proyecto_editorial/elastic/create.py** dentro do venv.

Tras facer isto, xa se pode acceder á aplicación en `localhost:8000`.
