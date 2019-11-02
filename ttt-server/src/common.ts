import { GameResponse } from "@grancalavera/ttt-api";
import {
  assertNever,
  coerceToPlayer,
  CoreGame,
  CoreGamePlaying,
  CoreMove,
  CorePlayer,
  CorePosition,
  CoreWin,
  CORE_GAME_PLAYING,
  findWin
} from "@grancalavera/ttt-core";
import { Avatar, Move, Player, Position, Win } from "./generated/models";
import { playerFromModel } from "./model";
import { GameModel } from "./store";

export const handleSimpleError = (error?: any) => {
  throw new Error(error);
};

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

export const findWinningMove = (gameResponse: GameResponse): Win | undefined => {
  const win = findWin("O", gameResponse.moves) || findWin("X", gameResponse.moves);
  return win ? coreWinToWin(win) : undefined;
};

const coreWinToWin = (coreWin: CoreWin): Win => ({
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
): Player => playerFromModel(corePlayer === "O" ? storeGame.userO! : storeGame.playerX!);

export const resolveWaitingPlayer = (storeGame: GameModel): Player => {
  if (storeGame.userO) {
    return playerFromModel(storeGame.userO);
  } else if (storeGame.playerX) {
    return playerFromModel(storeGame.playerX);
  } else {
    throw new Error("Illegal game: a game must have at least one player");
  }
};

export const isCoreGamePlaying = (coreGame: CoreGame): coreGame is CoreGamePlaying =>
  coreGame.kind === CORE_GAME_PLAYING;
