import { coerceToMove, CoreMove, CorePlayer, findWin } from "@grancalavera/ttt-core";
import { groupBy, map, pipe, values } from "ramda";
import { GameResponse, Move } from "../model";
import { MoveModel } from "../store";

export type Turn =
  | { kind: "AnyPlayer" }
  | { kind: "SomePlayer"; player: CorePlayer }
  | { kind: "NoPlayer" };

export const movesToGameResponse = (moves: Move[]): GameResponse => {
  return {
    id: moves[0].gameId,
    currentPlayer: currentPlayerFromMoves(moves),
    isGameOver: isGameOver(moves),
    winner: winnerFromMoves(moves),
    moves: movesToCoreMoves(moves)
  };
};

export const moveModelsToGameResponses = pipe(
  groupBy(({ gameId }: Move) => gameId),
  values,
  map(x => movesToGameResponse(x))
);

export const moveModelsToMoves = (moves: MoveModel[]): Move[] =>
  moves.map(moveModelToMove);

const movesToCoreMoves = (moves: Move[]): CoreMove[] => moves.map(m => m.coreMove);

export const moveModelToMove = ({ gameId, player, position }: MoveModel): Move => ({
  gameId,
  coreMove: coerceToMove([player, position])
});

export const currentTurn = (moves: Move[]): Turn => {
  if (moves.length === 0) {
    return { kind: "AnyPlayer" };
  } else if (moves.length >= 9 || winnerFromMoves(moves)) {
    return { kind: "NoPlayer" };
  } else {
    const [lastPlayer, _] = moves[moves.length - 1].coreMove;
    const player = lastPlayer === "O" ? "X" : "O";
    return { kind: "SomePlayer", player };
  }
};

export const winnerFromMoves = (moves: Move[]): CorePlayer | undefined => {
  const coreMoves = moves.map(({ coreMove }) => coreMove);
  if (findWin("O", coreMoves)) {
    return "O";
  } else if (findWin("X", coreMoves)) {
    return "X";
  } else {
    return undefined;
  }
};

export const currentPlayerFromMoves = (moves: Move[]): CorePlayer | undefined => {
  const turn = currentTurn(moves);
  return turn.kind === "SomePlayer" ? turn.player : undefined;
};

export const isGameOver = (moves: Move[]): boolean =>
  moves.length >= 9 || !!winnerFromMoves(moves);
