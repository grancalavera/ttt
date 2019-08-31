import {
  assertNever,
  coerceToMove,
  coerceToPlayer,
  coerceToPosition,
  CoreMove,
  CorePlayer,
  CorePosition,
  findWin
} from "@grancalavera/ttt-core";
import { StandaloneMoveModel as MoveModel } from "./store";

type Turn =
  | { kind: "AnyPlayer" }
  | { kind: "SomePlayer"; player: CorePlayer }
  | { kind: "NoPlayer" };

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
): Promise<MoveModel> => {
  const moves = await MoveModel.findAll({ where: { gameId } });
  const turn = currentTurn(gameId, moves);

  ensurePlayerCanPlayTurn(player, turn);
  ensureNoOneHasWonTheGame(gameId, moves);
  ensurePositionHasNotBeenPlayed(position, moves);

  return await MoveModel.create({ gameId, player, position });
};

const currentTurn = (gameId: string, moves: MoveModel[]): Turn => {
  if (moves.length === 0) {
    return { kind: "AnyPlayer" };
  } else if (moves.length === 9) {
    throw new GameOverError(gameId);
  } else {
    const lastMove = moves[moves.length - 1];
    const player = lastMove.player === "O" ? "X" : "O";
    return { kind: "SomePlayer", player };
  }
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
  const coreMoves: CoreMove[] = moves.map(({ player, position }) =>
    coerceToMove([player, position])
  );
  const oWins = !!findWin("O", coreMoves);
  const xWins = !!findWin("X", coreMoves);

  if (oWins || xWins) {
    throw new GameOverError(gameId);
  }
};
