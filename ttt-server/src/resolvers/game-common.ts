import { assertNever } from "@grancalavera/ttt-core";
import { GameEntity } from "entity/game-entity";
import { GamePlaying, GameStatus, GameWon, Token } from "generated/graphql";
import { isNil } from "lodash/fp";
import { UserEntity } from "entity/user-entity";

export const toGameStatus = (entity: GameEntity): GameStatus => {
  const getToken = tokenFromGameEntity(entity);

  switch (entity.status) {
    case "GamePlaying": {
      const result: GamePlaying = {
        __typename: "GamePlaying",
        id: entity.id,
        next: getToken("next"),
      };
      return result;
    }

    case "GameWon": {
      const result: GameWon = {
        __typename: "GameWon",
        id: entity.id,
        winner: getToken("winner"),
      };
      return result;
    }

    case "GameDraw": {
      return { __typename: "GameDraw", id: entity.id };
    }

    default: {
      return assertNever(entity.status);
    }
  }
};

export const ensureUserOwnsGame = (user: UserEntity, game: GameEntity) => {
  const ownedByO = user.id === game.O;
  const ownedByX = user.id === game.X;
  if (!ownedByO && !ownedByX) {
    throw new Error(`user ${user.id} not authorized to see game ${game.id}`);
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
