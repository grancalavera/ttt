import { useApolloClient, useQuery } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { loader } from "graphql.macro";
import React, { useEffect, useState } from "react";
import { ApolloProvider } from "react-apollo";
import ReactDOM from "react-dom";
import { Activity, useActivityState } from "./activity";
import { LoginForm } from "./login-form";
import { IsUserLoggedInQuery } from "./generated/models";
import { createLoginLogout } from "./login";
import { Me } from "./me";

import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";

const typeDefs = loader("./schema.graphql");

const IS_LOGGED_IN = loader("./query-is-user-logged-in.graphql");

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_APOLLO_HTTP_LINK_URL || "http://localhost:4000"
});

const authLink = setContext((_, { headers }) => {
  const context = {
    headers: {
      ...headers,
      authorization: localStorage.getItem("token"),
      "client-name": "ttt-client",
      "client-version": "0.0.0"
    }
  };
  return context;
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  typeDefs,
  resolvers: {}
});

client.cache.writeData({ data: { isLoggedIn: !!localStorage.getItem("token") } });

const TTT: React.FC = () => {
  const client = useApolloClient();
  const { doLogout } = createLoginLogout(client);
  const { data } = useQuery<IsUserLoggedInQuery>(IS_LOGGED_IN);
  const { isLoggedIn } = data!;
  const [didLoginFail, setDidLoginFail] = useState(false);
  const [activityState, setActivityState] = useActivityState(isLoggedIn, didLoginFail);

  useEffect(() => {
    setActivityState(isLoggedIn, didLoginFail);
  }, [isLoggedIn, didLoginFail, setActivityState]);

  switch (activityState) {
    case Activity.Idle:
      return <LoginForm onError={() => setDidLoginFail(true)} />;
    case Activity.Failed:
      return (
        <>
          <p>login failed!</p>
          <button
            onClick={() => {
              setDidLoginFail(false);
            }}
          >
            try again
          </button>
        </>
      );
    case Activity.Complete:
      return (
        <>
          <Me />
          <button onClick={doLogout}>logout</button>
        </>
      );
    default:
      return assertNever(activityState);
  }
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <TTT />
  </ApolloProvider>,
  document.getElementById("root")
);

export function assertNever(value: never): never {
  throw new Error(`unexpected value ${value}`);
}
