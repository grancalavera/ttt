import { assertNever } from "@grancalavera/ttt-core";
import { Context } from "context";
import { GameEntity } from "entity/game-entity";
import { UserEntity } from "entity/user-entity";
import {
  GameResult,
  JoinResult,
  PlayInput,
  Token,
  GamePlaying,
  GameWon,
  GameDraw,
} from "generated/graphql";
import { isNil } from "lodash/fp";

export const join = (ctx: Context) => async (
  user: UserEntity
): Promise<JoinResult> => {
  const { dataSources } = ctx;
  let gameEntity = await dataSources.games.findOpenGameForUser(user);
  let token;

  if (gameEntity) {
    token = Token.X;
    gameEntity = await dataSources.games.joinExistingGame(
      gameEntity,
      user,
      token
    );
  } else {
    token = Token.O;
    gameEntity = await dataSources.games.joinNewGame(user, token);
  }

  if (gameEntity.next) {
    return { gameId: gameEntity.id, token, next: Token[gameEntity.next] };
  }

  throw new Error("missing `next` in `GameEntity`");
};

export const play = (ctx: Context, input: PlayInput) => async (
  user: UserEntity
) => {
  throw new Error("`play` mutation not implemented");
};

export const myGames = (ctx: Context) => async (
  user: UserEntity
): Promise<GameResult[]> => {
  const { findGamesForUser } = ctx.dataSources.games;

  const gameEntities = await findGamesForUser(user);
  const gameResults = gameEntities.map(toGameResult);

  return gameResults;
};

const toGameResult = (entity: GameEntity): GameResult => {
  const getToken = tokenFromGameEntity(entity);
  switch (entity.status) {
    case "GamePlaying": {
      const result: GamePlaying = {
        __typename: "GamePlaying",
        id: entity.id,
        next: getToken("next"),
      };
      return result;
    }

    case "GameWon": {
      const result: GameWon = {
        __typename: "GameWon",
        id: entity.id,
        winner: getToken("winner"),
      };
      return result;
    }

    case "GameDraw": {
      return { __typename: "GameDraw", id: entity.id };
    }

    default: {
      return assertNever(entity.status);
    }
  }
};

const tokenFromGameEntity = (entity: GameEntity) => (
  token: "next" | "winner"
): Token => Token[ensureValue(`GameEntity.${token}`, entity[token])];

const ensureValue = <T>(label: string, candidate?: T): T => {
  if (isNil(candidate)) {
    throw new Error(`required value ${label} is undefined or null`);
  }
  return candidate;
};
