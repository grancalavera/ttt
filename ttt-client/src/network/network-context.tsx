import {
  ApolloClient,
  ApolloProvider,
  from as apolloLinkFrom,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { useConfiguration } from "configuration";
import { AnonymousUserLink } from "network/middleware";
import React, { useMemo } from "react";

export const NetworkProvider: React.FC = ({ children }) => {
  const { anonymousUserEndpoint, graphqlEndpoint } = useConfiguration();

  const client = useMemo(
    () =>
      new ApolloClient({
        link: apolloLinkFrom([
          new AnonymousUserLink(anonymousUserEndpoint.toString()),
          new HttpLink({
            uri: graphqlEndpoint.toString(),
            credentials: "include",
          }),
        ]),
        cache: new InMemoryCache(),
      }),
    [anonymousUserEndpoint, graphqlEndpoint]
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
