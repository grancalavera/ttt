import {
  assertNever,
  coerceToPlayer,
  coerceToPosition,
  CorePlayer,
  CorePosition
} from "@grancalavera/ttt-core";
import uuid from "uuid/v4";
import { currentTurn, Turn, winnerFromMoves } from "./controller-common";
import { ResponseMove } from "./model";
import { StandaloneMoveModel as MoveModel } from "./store";

export class PositionPlayedError extends Error {
  constructor(
    public readonly playedByPlayer: CorePlayer,
    public readonly playedPosition: CorePosition
  ) {
    super("Error: Position already played");
    this.name = "PositionPlayedError";
  }
}

export class GameOverError extends Error {
  constructor(public readonly gameId: string) {
    super("Error: Game over");
    this.name = "GameOverError";
  }
}

export class WrongTurnError extends Error {
  constructor(public readonly wrongPlayer: CorePlayer) {
    super("Error: Wrong turn");
    this.name = "WrongTurnError";
  }
}

export const playMove = async (
  gameId: string,
  player: CorePlayer,
  position: CorePosition
): Promise<ResponseMove> => {
  const moves = await MoveModel.findAll({ where: { gameId } });
  const turn = currentTurn(moves);

  ensurePlayerCanPlayTurn(player, turn);
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

const ensurePlayerCanPlayTurn = (player: CorePlayer, turn: Turn): void => {
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
      throw new GameOverError(player);
    default:
      assertNever(turn);
  }
};

const ensurePositionHasNotBeenPlayed = (
  position: CorePosition,
  moves: MoveModel[]
): void => {
  const maybeMove = moves.find(m => m.position === position);
  if (maybeMove) {
    const playedBy = coerceToPlayer(maybeMove.player);
    const playedPosition = coerceToPosition(maybeMove.position);
    throw new PositionPlayedError(playedBy, playedPosition);
  }
};

const ensureNoOneHasWonTheGame = (gameId: string, moves: MoveModel[]): void => {
  if (winnerFromMoves(moves)) {
    throw new GameOverError(gameId);
  }
};
