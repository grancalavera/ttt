import {
  ApolloClient,
  ApolloProvider,
  from as apolloLinkFrom,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { endpoints } from "configuration";
import { AnonymousUserLink } from "network/middleware";
import React from "react";
const { anonymousUserEndpoint, graphqlEndpoint } = endpoints;

const client = new ApolloClient({
  link: apolloLinkFrom([
    new AnonymousUserLink(anonymousUserEndpoint),
    new HttpLink({
      uri: graphqlEndpoint,
      credentials: "include",
    }),
  ]),
  cache: new InMemoryCache(),
});

export const NetworkProvider: React.FC = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
