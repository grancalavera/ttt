import { Context } from "context";
import { UserEntity } from "entity/user-entity";
import { PlayInput } from "generated/graphql";
import { apiMoveFromInput, validateNextPlayer } from "resolvers/game-common";

export const play = (ctx: Context, input: PlayInput) => async (
  userEntity: UserEntity
) => {
  const { gameId } = input;
  const gameEntity = await ctx.dataSources.games.findGameOwnedByUser(gameId, userEntity);

  validateNextPlayer(gameEntity, userEntity);

  const move = apiMoveFromInput(input);
  const moveResult = await ctx.dataSources.api.postMove(move);

  throw new Error("`play` mutation not implemented");
};
