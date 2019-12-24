import { Context } from "context";
import { UserEntity } from "entity/user-entity";
import { Token } from "generated/graphql";

export const join = (ctx: Context) => async (
  user: UserEntity
): Promise<string> => {
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

  return gameEntity.id;
};
