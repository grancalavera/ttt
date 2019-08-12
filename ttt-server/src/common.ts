import { ErrorResponse } from "@grancalavera/ttt-api";
import {
  coerceToPlayer,
  CORE_GAME_PLAYING,
  CoreGame,
  CoreGamePlaying,
  CoreMove,
  CorePlayer,
  CorePosition,
  CoreWin
} from "@grancalavera/ttt-core";

import { Avatar, Move, Player, Position, Win } from "./generated/models";
import { playerFromModel } from "./model";
import { GameModel } from "./store";

export const handleSimpleError = (error?: any) => {
  const errorResponse = getErrorResponse(error);
  throw new Error(errorResponse.message);
};

export const getErrorResponse = (error?: any): ErrorResponse => {
  if (
    error &&
    error.extensions &&
    error.extensions.response &&
    error.extensions.response.body &&
    error.extensions.response.body.code &&
    typeof error.extensions.response.body.code === "string" &&
    error.extensions.response.body.message &&
    typeof error.extensions.response.body.message === "string" &&
    error.extensions.response.body.context &&
    typeof error.extensions.response.body.context === "object"
  ) {
    return error.extensions.response.body as ErrorResponse;
  } else {
    throw new Error(error);
  }
};

export function assertNever(value: never): never {
  throw new Error(`unexpected value ${value}`);
}

export const chooseAvatar = (): Avatar => (Math.random() < 0.5 ? Avatar.X : Avatar.O);

export const coreMoveFromMove = (move: Move): CoreMove => {
  const player = coerceToPlayer(move.avatar);
  const position = corePositionFromPosition(move.position);
  return [player, position];
};

export const corePositionFromPosition = (position: Position): CorePosition => {
  switch (position) {
    case Position.A:
      return 0;
    case Position.B:
      return 1;
    case Position.C:
      return 2;
    case Position.D:
      return 3;
    case Position.E:
      return 4;
    case Position.F:
      return 5;
    case Position.G:
      return 6;
    case Position.H:
      return 7;
    case Position.I:
      return 8;
    default:
      return assertNever(position);
  }
};

export const coreWinToWin = (coreWin: CoreWin): Win => ({
  p1: positionFromCorePosition(coreWin[0]),
  p2: positionFromCorePosition(coreWin[1]),
  p3: positionFromCorePosition(coreWin[2])
});

export const positionFromCorePosition = (position: CorePosition): Position =>
  [
    Position.A,
    Position.B,
    Position.C,
    Position.D,
    Position.E,
    Position.F,
    Position.G,
    Position.H,
    Position.I
  ][position];

export const coreMoveToMove = ([player, position]: CoreMove): Move => ({
  position: positionFromCorePosition(position),
  avatar: player === "O" ? Avatar.O : Avatar.X
});

export const corePlayerToPlayer = (
  corePlayer: CorePlayer,
  storeGame: GameModel
): Player =>
  playerFromModel(corePlayer === "O" ? storeGame.playerO! : storeGame.playerX!);

export const resolveWaitingPlayer = (storeGame: GameModel): Player => {
  if (storeGame.playerO) {
    return playerFromModel(storeGame.playerO);
  } else if (storeGame.playerX) {
    return playerFromModel(storeGame.playerX);
  } else {
    throw new Error("Illegal game: a game must have at least one player");
  }
};

export const isCoreGamePlaying = (coreGame: CoreGame): coreGame is CoreGamePlaying =>
  coreGame.kind === CORE_GAME_PLAYING;
