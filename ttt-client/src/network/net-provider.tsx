import {
  ApolloClient,
  ApolloProvider,
  from as apolloLinkFrom,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { endpoints } from "./net-configuration";
import React from "react";
import { UserLink } from "./user-link";
const { anonymousUserEndpoint, graphqlEndpoint } = endpoints;

const client = new ApolloClient({
  link: apolloLinkFrom([
    new UserLink(anonymousUserEndpoint),
    new HttpLink({
      uri: graphqlEndpoint,
      credentials: "include",
    }),
  ]),
  cache: new InMemoryCache(),
});

export const NetworkProvider: React.FC = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
