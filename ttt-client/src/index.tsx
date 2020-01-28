import {
  ApolloClient,
  ApolloProvider,
  from as linkFrom,
  InMemoryCache,
} from "@apollo/client";
import { FocusStyleManager } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components/macro";
import { App } from "./App";
import { AppContextProvider } from "./app-context";
import "./index.scss";
import {
  authLinkMiddleware,
  httpLinkMiddleware,
  refreshJWTMiddleware,
} from "./middleware";

FocusStyleManager.onlyShowFocusOnTabs();

const client = new ApolloClient({
  link: linkFrom([refreshJWTMiddleware, authLinkMiddleware, httpLinkMiddleware]),
  cache: new InMemoryCache(),
});

const GlobalStyle = createGlobalStyle`
  body, html, #root {
    height: 100vh;
    max-width: 100vw;
    overflow: hidden;
  }
   #root {
    display: grid;
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
