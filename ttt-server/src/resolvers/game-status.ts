import { UserEntity } from "entity/user-entity";
import { Context } from "context";
import { ensureUserOwnsGame, toGameStatus } from "./game-common";

export const status = (ctx: Context, gameId: string) => async (
  user: UserEntity
) => {
  const gameEntity = await ctx.dataSources.games.findById(gameId);

  if (!gameEntity) {
    throw new Error(`game ${gameId} does not exist`);
  }

  ensureUserOwnsGame(user, gameEntity);

  return toGameStatus(gameEntity);
};
