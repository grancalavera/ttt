import { Context } from "context";
import { UserEntity } from "entity/user-entity";
import {
  JoinResult,
  PlayInput,
  Token,
  Game,
  GameState,
} from "generated/graphql";
import { GameEntity } from "entity/game-entity";

export const join = (ctx: Context) => async (
  user: UserEntity
): Promise<JoinResult> => {
  const { dataSources } = ctx;
  let game = await dataSources.games.findOpenGameForUser(user);
  let token;
  if (game) {
    token = Token.X;
    game = await dataSources.games.joinExistingGame(game, user, token);
  } else {
    token = Token.O;
    game = await dataSources.games.joinNewGame(user, token);
  }
  return { gameId: game.id, token, next: game.next! as Token };
};

export const play = (ctx: Context, input: PlayInput) => async (
  user: UserEntity
) => {
  throw new Error("play mutation not implemented");
};

export const myGames = (ctx: Context) => async (
  user: UserEntity
): Promise<Game[]> => {
  const games = await ctx.dataSources.games.findGamesForUser(user);
  return games.map(gameFromEntity);
};

const gameFromEntity = ({ id }: GameEntity): Game => {
  const state: GameState = { __typename: "GamePlaying", next: Token.O };
  const game = { id, state };
  return game;
};
