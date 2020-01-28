import { UserEntity } from "entity/user-entity";
import { Context } from "context";
import { toGameStatus } from "resolvers/game-common";

export const status = (ctx: Context, gameId: string) => async (
  userEntity: UserEntity
) => {
  const gameEntity = await ctx.dataSources.games.findGameOwnedByUser(gameId, userEntity);
  const apiResponse = await ctx.dataSources.api.getGameById(gameId);
  const result = toGameStatus(gameEntity, userEntity, apiResponse);
  return result;
};
