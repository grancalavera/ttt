import { InMemoryCache, IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import gql from "graphql-tag";
import * as isEmail from "isemail";
import fetch from "isomorphic-fetch";
import WebSocket from "ws";

import { JoinGameResult } from "../src/generated/models";
import introspectionResult from "./generated/introspection-result";

// https://www.apollographql.com/docs/react/recipes/authentication/#header
// https://github.com/apollographql/apollo-link/issues/513#issuecomment-384743835
// https://www.apollographql.com/docs/react/advanced/fragments/#fragment-matcher

const email = process.argv[2];
let authorization: string = "";

try {
  isEmail.validate(email);
} catch (e) {
  console.error(`invalid email "${email}"`);
  process.exit(1);
}

console.log(`welcome ${email}`);

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionResult
});
const cache = new InMemoryCache({
  fragmentMatcher
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
  fetch
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:5000/`,
  options: {
    reconnect: true
  },
  webSocketImpl: WebSocket
});

const authLink = setContext((_, { headers }) => {
  const context = {
    headers: {
      ...headers,
      authorization,
      "client-name": "ttt-test-client",
      "client-version": "0.0.0"
    }
  };
  return context;
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" && definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  cache,
  link,
  name: "ttt-test-client",
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network"
    }
  }
});

const loginMutation = gql`
  mutation Login($email: String!) {
    login(email: $email)
  }
`;

const joinGame = gql`
  mutation JoinGame {
    joinGame {
      __typename
      ... on GameLobby {
        id
      }
      ... on GamePlaying {
        id
        currentPlayer {
          user {
            email
          }
        }
      }
    }
  }
`;

client
  .mutate({ mutation: loginMutation, variables: { email } })
  .then(result => {
    authorization = result.data.login;
    console.log(`authorization: ${authorization}`);
  })
  .then(() => {
    return client.mutate({ mutation: joinGame });
  })
  .then(result => {
    const game: JoinGameResult = result.data.joinGame;
    console.log(`joined game with id: "${result.data.joinGame.id}"`);

    if (game.__typename === "GameLobby") {
      console.log("...waiting for more players to join");
    } else {
      console.log("...checking if it is our turn to play");
    }
  })
  .catch(e => {
    console.error(e.message || e);
    console.error(e.stack || "");
  });
