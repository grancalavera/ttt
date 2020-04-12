import { ApolloProvider } from "@apollo/client";
import "@blueprintjs/core/lib/css/blueprint.css";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { AppContextProvider } from "./app-context";
import { GlobalStyle } from "./common/global-style";
import "./index.scss";
import { LoaderContextProvider } from "./loader/use-loader";
import { client } from "./network/client";
import { ConfigurationProvider } from "./configuration/configuration-context";

ReactDOM.render(
  <ConfigurationProvider
    graphqlEndpoint={process.env.REACT_APP_GRAPHQL_ENDPOINT}
    refreshJWTEndpoint={process.env.REACT_APP_REFRESH_JWT_ENDPOINT}
  >
    <GlobalStyle />
    <ApolloProvider client={client}>
      <AppContextProvider>
        <LoaderContextProvider>
          <App />
        </LoaderContextProvider>
      </AppContextProvider>
    </ApolloProvider>
  </ConfigurationProvider>,
  document.getElementById("root")
);
