import uuid from "uuid/v4";
import { CoreMove, CorePlayer } from "@grancalavera/ttt-core";
import { MoveModel } from "./store";

export const alice: CorePlayer = "O";
export const bob: CorePlayer = "X";

export const moves_aliceWinsNext: CoreMove[] = [["O", 0], ["X", 1], ["O", 3], ["X", 4]];
export const moves_aliceTiesNext: CoreMove[] = [
  ["O", 0],
  ["X", 1],
  ["O", 2],
  ["X", 5],
  ["O", 4],
  ["X", 8],
  ["O", 7],
  ["X", 6]
];

export const move_alicePlaysOnZero: CoreMove = ["O", 0];
export const move_bobPlaysOnZero: CoreMove = ["X", 0];
export const move_alicePlaysOnOne: CoreMove = ["O", 1];

export const move_aliceWins: CoreMove = ["O", 6];
export const move_aliceTies: CoreMove = ["O", 3];

export const moves_gameOverAliceWins: CoreMove[] = [
  ...moves_aliceWinsNext,
  move_aliceWins
];
export const moves_gameOverAliceTies: CoreMove[] = [
  ...moves_aliceTiesNext,
  move_aliceTies
];

const bulkCreateMovesCurried = (moves: CoreMove[]) => async (
  gameId: string
): Promise<void> => {
  MoveModel.bulkCreate(
    moves.map(([player, position]: CoreMove) => ({
      id: uuid(),
      gameId,
      position,
      player
    })),
    { logging: false }
  );
};

export const mkGame_gameOverAliceWins = bulkCreateMovesCurried(moves_gameOverAliceWins);
export const mkGame_gameOverAliceTies = bulkCreateMovesCurried(moves_gameOverAliceTies);
export const bulkCreateMoves = (moves: CoreMove[], gameId: string) =>
  bulkCreateMovesCurried(moves)(gameId);
