import {
  ApolloClient,
  ApolloProvider,
  from as apolloLinkFrom,
  InMemoryCache
} from "@apollo/client";
import React, { useMemo } from "react";
import { useRefreshJWT, useAuthLink, useHttpLink } from "network/middleware";

export const NetworkProvider: React.FC = ({ children }) => {
  const refreshJWT = useRefreshJWT();
  const authLink = useAuthLink();
  const httpLink = useHttpLink();

  const client = useMemo(() => {
    return new ApolloClient({
      link: apolloLinkFrom([refreshJWT, authLink, httpLink]),
      cache: new InMemoryCache()
    });
  }, [httpLink, refreshJWT, authLink]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
