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
import {
  Avatar,
  Game,
  GameChanged,
  JoinGameResult,
  PlayMoveResult,
  Position
} from "../src/generated/models";
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
  uri: "ws://localhost:4000/graphql",
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
          avatar
        }
      }
    }
  }
`;

const subscribeToGameChanged = gql`
  subscription SubscribeToGameChanged($gameId: ID!) {
    gameChanged(gameId: $gameId) {
      __typename
      ... on GamePlaying {
        id
        moves {
          avatar
          position
        }
        currentPlayer {
          user {
            email
          }
          avatar
        }
      }
      ... on GameOverWin {
        winner {
          user {
            email
          }
        }
      }
    }
  }
`;

const playMove = gql`
  mutation PlayMove($gameId: ID!, $avatar: Avatar!, $position: Position!) {
    playMove(gameId: $gameId, avatar: $avatar, position: $position) {
      __typename
    }
  }
`;

client
  .mutate({ mutation: loginMutation, variables: { email } })
  .then(result => {
    authorization = result.data.login;
    console.log(`authorization: ${authorization}`);
    return client.mutate({ mutation: joinGame });
  })
  .then(result => {
    const game: JoinGameResult = result.data.joinGame;
    console.log(`joined game with id: "${result.data.joinGame.id}"`);

    const gameChanged$ = client.subscribe({
      fetchPolicy: "network-only",
      query: subscribeToGameChanged,
      variables: { gameId: game.id }
    });

    gameChanged$.subscribe(
      ({ data }) => {
        const update: GameChanged = data.gameChanged;
        onGameChanged(email, update);
        return;
      },
      error => {
        console.log(JSON.stringify(error, null, 2));
        return;
      },
      () => {
        return;
      }
    );

    if (game.__typename === "GameLobby") {
      console.log("waiting for more players to join...");
    } else {
      onGameChanged(email, game);
    }
  })
  .catch(e => {
    console.error(e.message || e);
    console.error(e.stack || "");
  });

const onGameChanged = (myEmail: string, game: Game): void => {
  if (game.__typename === "GamePlaying") {
    console.log("checking if it is our turn to play...");
    const currentEmail = game.currentPlayer.user.email;
    const { avatar } = game.currentPlayer;
    const gameId = game.id;

    if (currentEmail === myEmail) {
      console.log(`is ${myEmail}'s turn, playing`);
      const positions = shuffle([
        Position.A,
        Position.B,
        Position.C,
        Position.D,
        Position.E,
        Position.F,
        Position.G,
        Position.H,
        Position.I
      ]);

      tryMove(positions, gameId, avatar).catch(e => {
        console.error(`play failed`);
        console.log(e);
      });
    } else {
      console.log(`is not ${myEmail}'s turn, pass`);
    }
    return;
  }

  if (game.__typename === "GameOverTie" || game.__typename === "GameOverWin") {
    console.log("game over");
    return;
  }

  if (game.__typename === "GameLobby") {
    throw new Error("unexpected game state");
  }

  console.log("not our turn, waiting...");
};

const tryMove = (
  positions: Position[],
  gameId: string,
  avatar: Avatar
): Promise<void> => {
  const [position, ...rest] = positions;
  return client
    .mutate({ mutation: playMove, variables: { gameId, avatar, position } })
    .then(result => {
      const moveResult: PlayMoveResult = result.data.playMove;
      if (moveResult.__typename === "ErrorWrongMove") {
        console.log("ERROR! Move taken, trying again...");
        return tryMove(rest, gameId, avatar);
      }
    });
};

const shuffle = <T extends any>(list: T[]): T[] => {
  if (list.length === 0) {
    return [];
  } else {
    const i = randInt(0, list.length - 1);
    const x = list[i];
    const rest = [...list.slice(0, i), ...list.slice(i + 1)];
    return [x, ...shuffle(rest)];
  }
};

export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
