import {
  ApolloClient,
  ApolloProvider,
  from as apolloLinkFrom,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { endpoints } from "./configuration";
import React from "react";
import { AnonymousUserLink } from "./anonymous-user-link";
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
