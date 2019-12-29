import { assertNever, CoreMove, CorePosition } from "@grancalavera/ttt-core";
import { GameEntity } from "entity/game-entity";
import {
  GamePlaying,
  GameStatus,
  GameWon,
  Token,
  Move,
  Position,
} from "generated/graphql";
import { isNil } from "lodash/fp";
import { UserEntity } from "entity/user-entity";
import { GameAPIResponse } from "data-sources/ttt-api";
import { isGameResponse, isErrorResponse } from "@grancalavera/ttt-api";

export const toGameStatus = (
  gameEntity: GameEntity,
  userEntity: UserEntity,
  apiResponse: GameAPIResponse
): GameStatus => {
  const getToken = tokenFromGameEntity(gameEntity);
  const me = getUserToken(gameEntity, userEntity);
  const moves = movesFromAPIResponse(apiResponse);

  switch (gameEntity.status) {
    case "GamePlaying": {
      const result: GamePlaying = {
        __typename: "GamePlaying",
        id: gameEntity.id,
        next: getToken("next"),
        me,
        moves,
      };
      return result;
    }

    case "GameWon": {
      const result: GameWon = {
        __typename: "GameWon",
        id: gameEntity.id,
        winner: getToken("winner"),
        me,
        moves,
      };
      return result;
    }

    case "GameDraw": {
      return { __typename: "GameDraw", id: gameEntity.id, me, moves };
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
    throw new Error(`game entity ${entity.id} missing required ${tokenName} token`);
  }

  return Token[token];
};

const getUserToken = (gameEntity: GameEntity, userEntity: UserEntity): Token => {
  if (gameEntity.O === userEntity.id) {
    return Token.O;
  }

  if (gameEntity.X === userEntity.id) {
    return Token.X;
  }

  throw new Error(`
Fatal error: unable to find token for user ${userEntity.id} in game ${gameEntity.id}`);
};

const movesFromAPIResponse = (apiResponse: GameAPIResponse): Move[] => {
  if (isGameResponse(apiResponse)) {
    return apiResponse.moves.map(coreMoveToMove);
  }

  if (isErrorResponse(apiResponse) && apiResponse.kind === "GameNotFound") {
    return [];
  }

  throw new Error(JSON.stringify(apiResponse));
};

const coreMoveToMove = (coreMove: CoreMove): Move => {
  const [coreToken, corePosition] = coreMove;

  const token = Token[coreToken];
  const position = corePositionToPosition(corePosition);

  return { token, position };
};

type PositionChar = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";

const corePositionToPosition = (corePosition: CorePosition): Position => {
  const char = String.fromCharCode(65 + corePosition) as PositionChar;
  return Position[char];
};
