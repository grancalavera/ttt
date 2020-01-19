import { Context } from "context";
import { GameEntity } from "entity/game-entity";
import { UserId } from "entity/types";
import { UserEntity } from "entity/user-entity";
import { PlayInput, Token, Game } from "generated/graphql";

export const play = (ctx: Context, input: PlayInput) => async (
  userEntity: UserEntity
) => {
  const { gameId } = input;
  const gameEntity = await ctx.dataSources.games.findGameOwnedByUser(gameId, userEntity);

  validateNextPlayer(gameEntity, userEntity);

  throw new Error("`play` mutation not implemented");
};

const validateNextPlayer = (gameEntity: GameEntity, userEntity: UserEntity): void => {
  const userToken = tokenFromUserId(gameEntity, userEntity.id);
  if (userToken !== gameEntity.next) {
    throw new Error(`invalid player, user ${userEntity.id} is not the next player`);
  }
};

const tokenFromUserId = (GameEntity: GameEntity, userId: UserId): Token => {
  if (userId === GameEntity.O) {
    return Token.O;
  }

  if (userId === GameEntity.X) {
    return Token.X;
  }

  throw new Error(`not token found for user ${userId}`);
};
