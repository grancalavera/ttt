import { assertNever } from "@grancalavera/ttt-core";
import { GameEntity } from "entity/game-entity";
import { GamePlaying, GameStatus, GameWon, Token } from "generated/graphql";
import { isNil } from "lodash/fp";
import { UserEntity } from "entity/user-entity";

export const toGameStatus = (
  gameEntity: GameEntity,
  userEntity: UserEntity
): GameStatus => {
  const getToken = tokenFromGameEntity(gameEntity);
  const me = getUserToken(gameEntity, userEntity);

  switch (gameEntity.status) {
    case "GamePlaying": {
      const result: GamePlaying = {
        __typename: "GamePlaying",
        id: gameEntity.id,
        next: getToken("next"),
        me,
      };
      return result;
    }

    case "GameWon": {
      const result: GameWon = {
        __typename: "GameWon",
        id: gameEntity.id,
        winner: getToken("winner"),
        me,
      };
      return result;
    }

    case "GameDraw": {
      return { __typename: "GameDraw", id: gameEntity.id, me };
    }

    default: {
      return assertNever(gameEntity.status);
    }
  }
};

const tokenFromGameEntity = (entity: GameEntity) => (
  tokenName: "next" | "winner"
): Token => {
  const token = entity[tokenName];

  if (isNil(token)) {
    throw new Error(
      `game entity ${entity.id} missing required ${tokenName} token`
    );
  }

  return Token[token];
};

const getUserToken = (
  gameEntity: GameEntity,
  userEntity: UserEntity
): Token => {
  if (gameEntity.O === userEntity.id) {
    return Token.O;
  }

  if (gameEntity.X === userEntity.id) {
    return Token.X;
  }

  throw new Error(`
Fatal error: unable to find token for user ${userEntity.id} in game ${gameEntity.id}`);
};
