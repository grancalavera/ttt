import { InMemoryCache, IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { GameLobby, GamePlaying, JoinGameResult } from "../src/generated/models";
// udpate headers
// https://www.apollographql.com/docs/react/recipes/authentication/#header
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import * as isEmail from "isemail";
// https://github.com/apollographql/apollo-link/issues/513#issuecomment-384743835
import fetch from "isomorphic-fetch";
import { assertNever } from "../src/common";

// https://www.apollographql.com/docs/react/advanced/fragments/#fragment-matcher
import introspectionResult from "./generated/introspection-result";

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

const client = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
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
