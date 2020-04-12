import {
  ApolloClient,
  ApolloProvider,
  from as apolloLinkFrom,
  InMemoryCache
} from "@apollo/client";
import React, { useMemo } from "react";
import { useAuthLink } from "./middleware/auth-link";
import { useHttpLink } from "./middleware/http-link";
import { useRefreshJWT } from "./middleware/refresh-jwt";

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
