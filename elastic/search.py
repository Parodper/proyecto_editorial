from elasticsearch import Elasticsearch
import json

es = Elasticsearch(hosts=["http://elastic:E@localhost:9200"])

index_name = "libros"

# Verificar el número de documentos indexados
count = es.count(index=index_name)
print(f"Número total de documentos indexados: {count['count']}")

# Obtener una muestra de los documentos
sample = es.search(index=index_name, size=1)
print("Muestra de documento:", sample['hits']['hits'][0]['_source'])