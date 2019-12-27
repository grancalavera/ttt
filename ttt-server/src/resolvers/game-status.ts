import { UserEntity } from "entity/user-entity";
import { Context } from "context";
import { toGameStatus } from "./game-common";

export const status = (ctx: Context, gameId: string) => async (
  userEntity: UserEntity
) => {
  const gameEntity = await ctx.dataSources.games.findGameOwnedByUser(
    gameId,
    userEntity
  );

  if (!gameEntity) {
    throw new Error(`
Invalid query:
either game ${gameId} does not exist or user ${userEntity.id} is not authorized to see it.`);
  }

  return toGameStatus(gameEntity, userEntity);
};
