import React from "react";

import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  buildSortOptionsFromConfig,
  getConfig,
  getFacetFields
} from "./config/config-helper";

const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig();
const connector = new ElasticsearchAPIConnector({host: endpointBase, index: engineName });
const config = {
  searchQuery: {
    facets: buildFacetConfigFromConfig().facets,
    disjunctiveFacets: buildFacetConfigFromConfig().disjunctiveFacets,
    ...buildSearchOptionsFromConfig(),
  },
  autocompleteQuery: buildAutocompleteQueryConfig(),
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={<SearchBox autocompleteSuggestions={true} />}
                  sideContent={
                    <div>
                      <Facet key={"category"} field={"category.keyword"} label={"category"} isFilterable={true} />
                      <Facet key={"publication_date"} field={"publication_date"} label={"Publication date"}/>
                      <Facet key={"author"} field={"author.keyword"} label={"Author"} isFilterable={true} />
                    </div>
                  }
                  bodyContent={
                    <WithSearch mapContextToProps={({ results }) => ({ results })}>
                      {({ results }) => (
                        <div>
                          {results.map((result, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex", // Usamos flexbox para alinear la imagen y el texto
                                alignItems: "flex-start", // Alineación superior
                                border: "1px solid #ddd",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "5px",
                                backgroundColor: "#f9f9f9",
                                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              {/* Imagen más pequeña */}
                              {result.image?.raw && (
                                <img
                                  src={result.image.raw} // URL de la imagen desde Elasticsearch
                                  alt={result.title?.raw || "Imagen del libro"} // Alt text
                                  style={{
                                    width: "150px", // Tamaño más pequeño
                                    height: "auto", // Mantener proporciones
                                    borderRadius: "5px", // Bordes redondeados
                                    marginRight: "15px", // Espaciado entre la imagen y el texto
                                  }}
                                />
                              )}

                              {/* Contenido de texto */}
                              <div style={{ flex: 1 }}> {/* Flex para ocupar el resto del espacio */}
                                {/* Título con enlace */}
                                <a
                                  href={result.link?.raw || result.link || "#"}
                                  style={{
                                    textDecoration: "none", // Quita el subrayado
                                    color: "#0073e6", // Cambia el color del enlace
                                    fontSize: "18px", // Tamaño del texto
                                    fontWeight: "bold", // Texto en negrita
                                    display: "block", // Ocupa una línea completa
                                    marginBottom: "8px", // Espaciado inferior
                                  }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {result.title?.raw || "Sin título"}
                                </a>

                                {/* Autor */}
                                <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
                                  <strong>Autor:</strong> {result.author?.raw || "Autor desconocido"}
                                </p>

                                {/* Categoría */}
                                <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
                                  <strong>Categoría:</strong>{" "}
                                  {result.category?.raw
                                    ? Array.isArray(result.category.raw)
                                      ? result.category.raw.join(", ") // Une el array con comas
                                      : result.category.raw // Si no es un array, muestra el texto
                                    : "Categoría no disponible"}
                                </p>

                                {/* Fecha de publicación */}
                                <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
                                  <strong>Fecha de publicación:</strong> {result.publication_date?.raw || "Fecha no disponible"}
                                </p>

                                {/* ISBN */}
                                <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
                                  <strong>ISBN:</strong> {result.isbn?.raw || "ISBN no disponible"}
                                </p>

                                {/* Sinopsis */}
                                <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
                                  {result.synopsis?.raw || "Sinopsis no disponible"}
                                </p>
                              </div>
                            </div>
                          ))}
                          
                        </div>
                      )}
                    </WithSearch>
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
                    </React.Fragment>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
