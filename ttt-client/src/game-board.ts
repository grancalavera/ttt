import { assertNever } from "@grancalavera/ttt-core";
import { GameStatus, Move, Position, Token } from "./generated/graphql";

export type CellState = FreeCell | PlayedCell | EmptyCell;

type FreeCell = {
  kind: "free";
  move: Move;
};

type PlayedCell = {
  kind: "played";
  move: Move;
};

type EmptyCell = {
  kind: "empty";
};

export const updateBoard = (game: GameStatus): CellState[] => {
  if (!game.__typename) {
    throw new Error("__typename is required");
  }

  const select = selectCell(getPlayedCellByIndex(game.moves));

  switch (game.__typename) {
    case "GamePlaying":
      return freeBoard(game.me).map(select);
    case "GameDraw":
    case "GameWon":
      return EMPTY_BOARD.map(select);
    default:
      return assertNever(game.__typename);
  }
};

type FindPlayedCell = (i: Index) => Maybe<PlayedCell>;
type SelectCell = <T extends FreeCell | EmptyCell>(
  findCell: FindPlayedCell
) => (cell: T, i: Index) => CellState;
type Index = number;
type Maybe<T> = T | undefined;

const selectCell: SelectCell = findCell => (cell, i) => findCell(i) ?? cell;

const BOARD = [...Array(9)].map((_, i) => i);

const EMPTY_BOARD = BOARD.map(() => ({ kind: "empty" as const }));

const freeBoard = (token: Token): FreeCell[] =>
  BOARD.map(i => ({
    kind: "free",
    move: { position: indexToPosition(i), token },
  }));

const getPlayedCellByIndex = (moves: readonly Move[]) => (
  i: number
): Maybe<PlayedCell> => {
  const move = moves.find(move => move.position === indexToPosition(i));
  return move ? { kind: "played", move } : undefined;
};

const indexToPosition = (i: number): Position => String.fromCharCode(65 + i) as Position;
