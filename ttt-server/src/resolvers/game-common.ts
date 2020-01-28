import { isErrorResponse, isGameResponse, Move as APIMove } from "@grancalavera/ttt-api";
import { assertNever, CoreMove, CorePosition } from "@grancalavera/ttt-core";
import { GameAPIResponse } from "data-sources/ttt-api";
import { GameEntity } from "entity/game-entity";
import { UserEntity } from "entity/user-entity";
import {
  GamePlaying,
  GameStatus,
  GameWon,
  PlayInput,
  Position,
  Token,
  Move,
} from "generated/graphql";
import { isNil } from "lodash/fp";
import { UserId } from "model";

export const toGameStatus = (
  gameEntity: GameEntity,
  userEntity: UserEntity,
  apiResponse: GameAPIResponse
): GameStatus => {
  const getToken = tokenFromGameEntity(gameEntity);
  const me = tokenFromUserId(gameEntity, userEntity.id);
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

export const apiMoveFromInput = (input: PlayInput): APIMove => {
  const { gameId, position, token } = input;
  const corePosition = positionToCorePosition(position);
  return { gameId, coreMove: [token, corePosition] };
};

export const validateNextPlayer = (
  gameEntity: GameEntity,
  userEntity: UserEntity
): void => {
  const userToken = tokenFromUserId(gameEntity, userEntity.id);
  if (userToken !== gameEntity.next) {
    throw new Error(`invalid player, user ${userEntity.id} is not the next player`);
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

const tokenFromUserId = (gameEntity: GameEntity, userId: UserId): Token => {
  if (userId === gameEntity.O) {
    return Token.O;
  }

  if (userId === gameEntity.X) {
    return Token.X;
  }

  throw new Error(`not token found for user ${userId}`);
};

const movesFromAPIResponse = (apiResponse: GameAPIResponse): Move[] => {
  if (isGameResponse(apiResponse)) {
    return apiResponse.moves.map(coreMoveToAPIMove);
  }

  if (isErrorResponse(apiResponse) && apiResponse.kind === "GameNotFound") {
    return [];
  }

  throw new Error(JSON.stringify(apiResponse));
};

const coreMoveToAPIMove = (coreMove: CoreMove): Move => {
  const [coreToken, corePosition] = coreMove;

  const token = Token[coreToken];
  const position = corePositionToPosition(corePosition);

  return { token, position };
};

const corePositionToPosition = (corePosition: CorePosition) => {
  return String.fromCharCode(65 + corePosition) as Position;
};

const positionToCorePosition = (position: Position) => {
  const charCode = position.charCodeAt(0);
  const corePosition = charCode - 65;
  if (charCode < 0 || 8 < charCode) {
    throw new Error(`core position ${corePosition} is out of range [0, 8]`);
  }
  return corePosition as CorePosition;
};
