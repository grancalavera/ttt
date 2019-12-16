import {
  ErrorResponse,
  GameResponse,
  isErrorResponse,
  isGameResponse,
} from "@grancalavera/ttt-api";
import { Context } from "context";
import { GameAPIResponse } from "data-sources/ttt-api";
import { UserEntity } from "entity/user-entity";
import {
  Game,
  GameDraw,
  GamePlaying,
  GameResult,
  GameWon,
  JoinResult,
  PlayInput,
  Token,
} from "generated/graphql";

type ErrorTransformer = FailOnAnyError | Assume404IsNew;

interface FailOnAnyError {
  kind: "FailOnAnyError";
}

interface Assume404IsNew {
  kind: "Assume404IsNew";
  id: string;
}

export const join = (ctx: Context) => async (
  user: UserEntity
): Promise<JoinResult> => {
  const { dataSources } = ctx;
  let existingGame = await dataSources.games.findOpenGameForUser(user);
  let token;
  let next;

  if (existingGame) {
    token = Token.X;
    next = Token.O;
    existingGame = await dataSources.games.joinExistingGame(
      existingGame,
      user,
      token
    );
  } else {
    token = Token.O;
    next = Token.O;
    existingGame = await dataSources.games.joinNewGame(user, token);
  }
  // but if we want to be consistent then we need to take next
  // from ttt-api and assume 404 means next = Token.O
  return { gameId: existingGame.id, token, next };
};

export const play = (ctx: Context, input: PlayInput) => async (
  user: UserEntity
) => {
  throw new Error("play mutation not implemented");
};

export const myGames = (ctx: Context) => async (
  user: UserEntity
): Promise<Game[]> => {
  const { findGamesForUser } = ctx.dataSources.games;
  const { getGameById } = ctx.dataSources.api;

  const gameEntities = await findGamesForUser(user);

  const gameResponses = await Promise.all(
    gameEntities.map(({ id }) => {
      return getGameById(id).then(response => ({ id, response }));
    })
  );

  const games = gameResponses.map(({ id, response }) =>
    gameResultFromAPIResponse(id, response)
  );

  return games;
};

const gameResultFromAPIResponse = (
  id: string,
  apiResponse: GameAPIResponse
): GameResult => {
  if (isGameResponse(apiResponse)) {
    return gameResultFromGameResponse(apiResponse);
  }

  if (isErrorResponse(apiResponse)) {
    return gameResultFromErrorResponse(apiResponse, {
      kind: "Assume404IsNew",
      id,
    });
  }

  throw new Error("unexpected ttt-api response");
};

const gameResultFromGameResponse = (response: GameResponse): GameResult => {
  const { isGameOver, currentPlayer, winner, id } = response;

  if (isGameOver && winner) {
    const result: GameWon = {
      __typename: "GameWon",
      id,
      winner: Token[winner],
    };
    return result;
  }

  if (isGameOver) {
    const result: GameDraw = {
      __typename: "GameDraw",
      id,
    };
    return result;
  }

  if (currentPlayer) {
    const result: GamePlaying = {
      __typename: "GamePlaying",
      id,
      next: Token[currentPlayer],
    };
    return result;
  }

  throw new Error(
    `gameResultFromGameResponse: unable to infer game state for game ${id}`
  );
};

const gameResultFromErrorResponse = (
  response: ErrorResponse,
  errorTransformer: ErrorTransformer = { kind: "FailOnAnyError" }
): GameResult => {
  if (
    response.kind === "GameNotFound" &&
    errorTransformer.kind === "Assume404IsNew"
  ) {
    const result: GamePlaying = {
      id: errorTransformer.id,
      __typename: "GamePlaying",
      next: Token.O,
    };
    return result;
  }

  throw new Error(
    "gameResultFromErrorResponse: unable to transform error into `GameResponse`"
  );
};
