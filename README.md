# Práctica 1 de RIWS

## Lanzar o Scrapy

1. Crear un venv: `python -m venv .`
2. Hacer `pip install -r requirements.txt`
3. Dende a carpeta de **proyecto_editorial** executar scrapy: `scrapy crawl planeta`.

Isto xera un ficheiro output.json (está dispoñible unha versión de exemplo en **proyecto_editorial/practica/data**). Este ficheiro cópiase ao cartafol  **proyecto_editorial/elastic**.

## Lanzar Elastic

Para lanzar elastic hai que lanzar o Docker compose definido en **proyecto_editorial/elastic.yml**. En sistemas UNIX faise dende  **proyecto_editorial** con `docker compose -f elastic.yml up` (nalgúns sistemas pode que teñas que usar `docker-compose`). Unha vez iniciado, dende outra terminal, entrase no mesmo venv da parte de Scrapy e faise `pip install elasticsearch`. Tras isto execútase (dende **proyecto_editorial/elastic**) o programa **proyecto_editorial/elastic/create.py** dentro do venv.

## Iniciar a aplicación

Para iniciar a aplicación, e mentres Elastic está en execución, execútase isto dende **proyecto_editorial/elastic/app-search-reference-ui-react-master**:

```bash
yarn add @elastic/search-ui-elasticsearch-connector
yarn start
```

Tras facer isto, xa se pode acceder á aplicación en `localhost:3000`.
