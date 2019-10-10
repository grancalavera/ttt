import { MoveModel } from "../store";
import { CorePlayer, CoreMove, coerceToMove, findWin } from "@grancalavera/ttt-core";

export type Turn =
  | { kind: "AnyPlayer" }
  | { kind: "SomePlayer"; player: CorePlayer }
  | { kind: "NoPlayer" };

export const currentTurn = (moves: MoveModel[]): Turn => {
  if (moves.length === 0) {
    return { kind: "AnyPlayer" };
  } else if (moves.length >= 9 || winnerFromMoves(moves)) {
    return { kind: "NoPlayer" };
  } else {
    const lastMove = moves[moves.length - 1];
    const player = lastMove.player === "O" ? "X" : "O";
    return { kind: "SomePlayer", player };
  }
};

export const currentPlayerFromMoves = (moves: MoveModel[]): CorePlayer | undefined => {
  const turn = currentTurn(moves);
  return turn.kind === "SomePlayer" ? turn.player : undefined;
};

export const winnerFromMoves = (moves: MoveModel[]): CorePlayer | undefined => {
  const coreMoves = coreMovesFromMoves(moves);

  if (findWin("O", coreMoves)) {
    return "O";
  } else if (findWin("X", coreMoves)) {
    return "X";
  } else {
    return undefined;
  }
};

export const isGameOverFromMoves = (moves: MoveModel[]): boolean =>
  moves.length >= 9 || !!winnerFromMoves(moves);

export const coreMovesFromMoves = (moves: MoveModel[]): CoreMove[] =>
  moves.map(({ player, position }) => coerceToMove([player, position]));
