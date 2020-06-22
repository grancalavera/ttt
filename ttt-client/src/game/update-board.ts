import { WithTypename } from "../common/with-typename";
import { amINext } from "./turn";
import { GameState, Move, Position, Token } from "../generated/graphql";
import { CellState, DisabledCell, FreeCell, PlayedCell } from "./types";

export const updateBoard = (gameState: WithTypename<GameState>): CellState[] => {
  const select = selectCell(getPlayedCellByIndex(gameState.moves));

  switch (gameState.__typename) {
    case "GamePlayingState":
      return amINext(gameState)
        ? freeBoard(gameState.me).map(select)
        : EMPTY_BOARD.map(select);
    case "GameOverDrawState":
    case "GameOverWonState":
      return EMPTY_BOARD.map(select);
    default: {
      const never: never = gameState;
      throw new Error(`unknown game state ${never}`);
    }
  }
};

type FindPlayedCell = (i: Index) => PlayedCell | undefined;

type SelectCell = <T extends FreeCell | DisabledCell>(
  findCell: FindPlayedCell
) => (cell: T, i: Index) => CellState;

type Index = number;

const selectCell: SelectCell = (findCell) => (cell, i) => findCell(i) ?? cell;

const BOARD = Array.from({ length: 9 }, (_, i) => i);

const EMPTY_BOARD = BOARD.map(() => ({ kind: "disabled" as const }));

const freeBoard = (token: Token): FreeCell[] =>
  BOARD.map((i) => ({
    kind: "free",
    move: { position: indexToPosition(i), token },
  }));

const getPlayedCellByIndex = (moves: readonly Move[]) => (
  i: number
): PlayedCell | undefined => {
  const move = moves.find((move) => move.position === indexToPosition(i));
  return move ? { kind: "played", move } : undefined;
};

const indexToPosition = (i: number): Position => String.fromCharCode(65 + i) as Position;
