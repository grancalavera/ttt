import {
  ApolloClient,
  ApolloProvider,
  from as linkFrom,
  InMemoryCache
} from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import {
  authLinkMiddleware,
  httpLinkMiddleware,
  refreshJWTMiddleware
} from "./middleware";

const client = new ApolloClient({
  link: linkFrom([refreshJWTMiddleware, authLinkMiddleware, httpLinkMiddleware]),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
