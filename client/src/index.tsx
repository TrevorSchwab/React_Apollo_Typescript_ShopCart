import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-client";
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import FilterableProductTable from "./App";
import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({
  link: createHttpLink({ uri: 'http://localhost:4000/' }),
  cache: new InMemoryCache({
    addTypename: false,
  })
});

console.log('client ', client)

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <FilterableProductTable />
    </ApolloProvider>
  )
}

ReactDOM.render(
  <Root />,
  document.getElementById("root")
);

serviceWorker.unregister();
