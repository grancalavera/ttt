import { UserEntity } from "entity/user-entity";
import { Context } from "context";
import { toGameStatus } from "./game-common";

export const status = (ctx: Context, gameId: string) => async (
  user: UserEntity
) => {
  const gameEntity = await ctx.dataSources.games.findGameOwnedByUser(
    gameId,
    user
  );

  if (!gameEntity) {
    throw new Error(`
Invalid query:
either game ${gameId} does not exist or user ${user.id} is not authorized to see it.`);
  }

  return toGameStatus(gameEntity);
};
