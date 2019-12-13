import { Context } from "context";
import { User } from "entity/user";
import { JoinResult, PlayInput, Token, Game } from "generated/graphql";

export const join = (ctx: Context) => async (
  user: User
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

export const play = (ctx: Context, input: PlayInput) => async (user: User) => {
  throw new Error("play mutation not implemented");
};

export const myGames = (ctx: Context) => async (
  user: User
): Promise<Game[]> => {
  const games = await ctx.dataSources.games.findGamesForUser(user);
  return games.map(({ id }) => ({ id }));
};
