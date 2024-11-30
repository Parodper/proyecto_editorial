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
                      {wasSearched && (
                        <Sorting
                          label={"Sort by"}
                          sortOptions={buildSortOptionsFromConfig()}
                        />
                      )}

                      <Facet key={"category"} field={"category.keyword"} label={"category"} />
                      <Facet key={"publication_date"} field={"publication_date"} label={"Publication date"} />
                      <Facet key={"author"} field={"author"} label={"Author"} />

                    </div>
                  }
                  bodyContent={
                    <WithSearch mapContextToProps={({ results }) => ({ results })}>
                      {({ results }) => (
                        <div>
                          {results.map((result, index) => (
                            <div key={index}
                            style={{
                              border: "1px solid #ddd",
                              padding: "10px",
                              marginBottom: "10px",
                              borderRadius: "5px",
                              backgroundColor: "#f9f9f9",
                              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                            }}
                            >
                              <a
                                href={result.link.raw || result.link}
                                style={{
                                  textDecoration: "none", // Quita el subrayado
                                  color: "#0073e6",       // Cambia el color del enlace (opcional)
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {result.title.raw}
                              </a>
                              
                              <p></p>
                              {result.author.raw}
                              <p></p>
                              {result.category.raw}
                              <p></p>
                              {result.synopsis.raw}
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
