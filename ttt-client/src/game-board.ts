import { GamePlaying, Move, Token, Position } from "./generated/graphql";

export interface CellState {
  move: Move;
  isFree: boolean;
}

export const generateBoard = (game: GamePlaying) => {
  const moveMap = toMoveMap(game.moves);

  return initialBoard(game.me).map(cell => {
    const move = moveMap[cell.move.position];
    if (move) {
      return { isFree: false, move };
    } else {
      return cell;
    }
  });
};

export const initialBoard = (token: Token) =>
  [...Array(9)].map((_, i) => ({
    isFree: true,
    move: { position: indexToPosition(i), token },
  }));

const indexToPosition = (i: number): Position => String.fromCharCode(65 + i) as Position;

const toMoveMap = (moves: readonly Move[]): Record<Position, Move | undefined> =>
  moves.reduce((map, move) => ({ ...map, [move.position]: move }), {
    [Position.A]: undefined,
    [Position.B]: undefined,
    [Position.C]: undefined,
    [Position.D]: undefined,
    [Position.E]: undefined,
    [Position.F]: undefined,
    [Position.G]: undefined,
    [Position.H]: undefined,
    [Position.I]: undefined,
  });
