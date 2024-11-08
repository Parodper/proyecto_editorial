from elasticsearch import Elasticsearch
import json

es = Elasticsearch(hosts=["http://elastic:E@localhost:9200"])

print(f'Conectado {es}')

index_name = "libros"

mapping = {
	"mappings": {
		"properties": {
			"link": {"type": "text"},
			"title": {"type": "text"},
			"author": {"type": "text"},
			"synopsis": {"type": "text"},
			"category": {"type": "text"},
			"isbn": {"type": "text"},
			"publication_date": {"type": "text"}
		}
	}
}

es.indices.create(index=index_name, body=mapping)

n = 1
with open('output.json', 'r') as f:
	d = json.loads(f.read())
	for doc in d:
		es.index(index=index_name, id=n, body=doc)
		n += 1

print(f'Loaded {n} files')
