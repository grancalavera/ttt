import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider, Query } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { loader } from "graphql.macro";
import { resolvers } from "./resolvers";
import { IsUserLoggedInQuery } from "./generated/models";

const typeDefs = loader("./schema.graphql");
const IS_LOGGED_IN = loader("./query-is-user-logged-in.graphql");
const cache = new InMemoryCache();

const link = new HttpLink({
  uri: process.env.REACT_APP_APOLLO_HTTP_LINK_URL || "http://localhost:4000",
  headers: {
    authorization: localStorage.getItem("token"),
    "client-name": "ttt-client",
    "client-version": "0.0.0"
  }
});

const client = new ApolloClient({
  cache,
  link,
  typeDefs,
  resolvers
});

cache.writeData({ data: { isLoggedIn: !!localStorage.getItem("token") } });

ReactDOM.render(
  <ApolloProvider client={client}>
    <Query<IsUserLoggedInQuery> query={IS_LOGGED_IN}>
      {({ data }) => {
        if (data && data.isLoggedIn) {
          return <div>is logged in</div>;
        } else {
          return <div>is logged out</div>;
        }
      }}
    </Query>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
