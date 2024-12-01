from elasticsearch import Elasticsearch
import json

es = Elasticsearch(hosts=["http://elastic:E@localhost:9200"])

print(f'Conectado {es}')

index_name = "libros"

mapping = {
	"mappings": {
		"properties": {
			"link": {"type": "text"},
			"title_completion": {"type": "completion", "analyzer": "autocomplete", "search_analyzer": "standard"},
			"title": {"type": "text"},
			"synopsis": {"type": "text"},
			"image": {"type": "text"},
			"author": {
                "type": "text",
                "fields": {
                     "keyword": {
                          "type": "keyword"
					 }
				}
            },
			"category": {
                "type": "text",
                "fields": {
                     "keyword": {
                          "type": "keyword"
					 }
				}
            },
			"isbn": {"type": "text"},
			"publication_date": {
				"type": "date",
				"format": "yyyy-MM-dd"
			}
		}
	},
	"settings": {
		"analysis": {
		"analyzer": {
			"autocomplete": {
			"tokenizer": "standard",
			"filter": ["lowercase"]
			}
		}
		}
	}
}

# Verificar si el índice existe y eliminarlo si es necesario
if es.indices.exists(index=index_name):
	es.indices.delete(index=index_name)
	print(f'Índice {index_name} eliminado')

# Crear el nuevo índice
es.indices.create(index=index_name, body=mapping)
print(f'Índice {index_name} creado')

n = 1
with open('./practica/data/output.json', 'r', encoding='utf-8') as f:
    d = json.loads(f.read())
    for doc in d:
        if 'title' in doc:
            doc['title_completion'] = doc['title']
        es.index(index=index_name, id=n, body=doc)
        n += 1

print(f'Loaded {n} files')