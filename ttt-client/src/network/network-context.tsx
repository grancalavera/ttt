import {
  ApolloClient,
  ApolloProvider,
  from as apolloLinkFrom,
  InMemoryCache,
} from "@apollo/client";
import { useAnonymousUser, useAuthLink, useHttpLink } from "network/middleware";
import React, { useMemo } from "react";

export const NetworkProvider: React.FC = ({ children }) => {
  const anonymousUser = useAnonymousUser();
  const authLink = useAuthLink();
  const httpLink = useHttpLink();

  const client = useMemo(() => {
    return new ApolloClient({
      link: apolloLinkFrom([anonymousUser, authLink, httpLink]),
      cache: new InMemoryCache(),
    });
  }, [httpLink, anonymousUser, authLink]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
