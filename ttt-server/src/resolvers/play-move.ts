import { Position, Avatar, PlayMoveResult, Move } from "../generated/models";
import { Context } from "../environment";
import { handleMoveError } from "./common";
import { CoreMove, coerceToPlayer, CorePosition } from "@grancalavera/ttt-core";
import { assertNever } from "../common";

const corePositionFromPosition = (position: Position): CorePosition => {
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

const coreMoveFromMove = (move: Move): CoreMove => {
  const { avatar, position } = move;
  const player = coerceToPlayer(avatar.valueOf());
  const pos = corePositionFromPosition(position);
  return [player, pos];
};

export const playMove = async (
  gameId: string,
  avatar: Avatar,
  position: Position,
  context: Context
): Promise<PlayMoveResult> => {
  const { gameAPI, gameStore } = context.dataSources;
  try {
    const move = coreMoveFromMove({ avatar, position });
    const { game: coreGame } = await gameAPI.postMove(gameId, move);
    const storeGame = await gameStore.findGameById(gameId);
    return {} as PlayMoveResult;
  } catch (e) {
    return handleMoveError(e);
  }
};
