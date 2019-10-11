import { assertNever, CoreMove, CorePlayer, CorePosition } from "@grancalavera/ttt-core";
import uuid from "uuid/v4";
import { GameOverError, PositionPlayedError, WrongTurnError } from "../etc/exceptions";
import { MoveResponse, Move } from "../model";
import { MoveModel } from "../store";
import { moveModelsToMoves, currentTurn, Turn, winnerFromMoves } from "./common";

export const playMove = async (
  gameId: string,
  player: CorePlayer,
  position: CorePosition
): Promise<MoveResponse> => {
  const moveModels = await MoveModel.findAll({ where: { gameId } });
  const moves = moveModelsToMoves(moveModels);
  const turn = currentTurn(moves);

  ensurePlayerCanPlayTurn(gameId, player, turn);
  ensureNoOneHasWonTheGame(gameId, moves);
  ensurePositionHasNotBeenPlayed(position, moves);

  const id = uuid();
  const move = { id, gameId, player, position };

  try {
    await MoveModel.create(move);
  } catch (e) {
    throw new Error(`failed to create move: ${JSON.stringify(move, null, 2)}`);
  }

  return move;
};

const ensurePlayerCanPlayTurn = (
  gameId: string,
  player: CorePlayer,
  turn: Turn
): void => {
  switch (turn.kind) {
    case "AnyPlayer":
      return;
    case "SomePlayer":
      if (player === turn.player) {
        return;
      } else {
        throw new WrongTurnError(player);
      }
    case "NoPlayer":
      throw new GameOverError(gameId);
    default:
      assertNever(turn);
  }
};

const ensurePositionHasNotBeenPlayed = (position: CorePosition, moves: Move[]): void => {
  const maybeMove = moves.find(m => m.coreMove[1] === position);
  if (maybeMove) {
    const [playedBy, playedPosition] = maybeMove.coreMove;
    throw new PositionPlayedError(playedBy, playedPosition);
  }
};

const ensureNoOneHasWonTheGame = (gameId: string, moves: Move[]): void => {
  if (winnerFromMoves(moves)) {
    throw new GameOverError(gameId);
  }
};
