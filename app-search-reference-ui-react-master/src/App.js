import React from "react";

import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
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

//const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig();
//const connector = new ElasticsearchAPIConnector("http://localhost:9200", "libros");
const connector = new ElasticsearchAPIConnector({
  host: "http://localhost:9200", // Reemplaza con la URL de tu servidor Elasticsearch
  index: "libros",      // Reemplaza con el nombre de tu índice
});

// Campos clave del índice
const titleField = "title";
const urlField = "link";
const facetFields = ["author", "category"]; // Campos a mostrar como facetas

const config = {
  searchQuery: {
    facets: {
      author: { type: "value" },
      category: { type: "value" }
    },
    search_fields: {
      title: {},
      synopsis: {},
      author: {}
    },
    result_fields: {
      title: { raw: {} },
      link: { raw: {} },
      synopsis: { raw: {} },
      category: { raw: {} }
    }
  },
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
                      {wasSearched && (
                        <Sorting
                          label={"Sort by"}
                          sortOptions={[
                            { name: "Relevance", value: "", direction: "" },
                            { name: "Title (A-Z)", value: "title", direction: "asc" }
                          ]}
                        />
                      )}
                      {facetFields.map((field) => (
                        <Facet key={field} field={field} label={field} />
                      ))}
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField={titleField}
                      urlField={urlField}
                      shouldTrackClickThrough={true}
                    />
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