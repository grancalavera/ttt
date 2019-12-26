import { Context } from "context";
import { UserEntity } from "entity/user-entity";
import { Token } from "generated/graphql";

export const myToken = (ctx: Context, gameId: string) => async (
  user: UserEntity
) => {
  const gameEntity = await ctx.dataSources.games.findGameOwnedByUser(
    gameId,
    user
  );

  if (gameEntity.O === user.id) {
    return Token.O;
  }

  if (gameEntity.X === user.id) {
    return Token.X;
  }

  throw new Error(`
Invalid query:
unable to find token for user ${user.id} in game ${gameId}.
`);
};
