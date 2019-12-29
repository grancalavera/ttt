import {
  ApolloClient,
  ApolloProvider,
  from as linkFrom,
  InMemoryCache,
} from "@apollo/client";
import "@blueprintjs/core/lib/css/blueprint.css";
import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components/macro";
import { App } from "./App";
import "./index.scss";
import {
  authLinkMiddleware,
  httpLinkMiddleware,
  refreshJWTMiddleware,
} from "./middleware";
import { AppContextProvider } from "./app-context";

const client = new ApolloClient({
  link: linkFrom([
    refreshJWTMiddleware,
    authLinkMiddleware,
    httpLinkMiddleware,
  ]),
  cache: new InMemoryCache(),
});

const GlobalStyle = createGlobalStyle`
  body, html, #root {
    display:grid;
    height:100%;
  }
`;

ReactDOM.render(
  <>
    <GlobalStyle />
    <ApolloProvider client={client}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ApolloProvider>
  </>,
  document.getElementById("root")
);
