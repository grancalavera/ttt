import { Game, Move, Moves, Players } from "model";
import { alice, bob, defaultGameId } from "test-support";

const size = 3;
const players: Players = [alice, bob];

export const aliceDrawOnNextMove: Moves = [
  [alice, 0],
  [bob, 3],
  [alice, 6],
  [bob, 4],
  [alice, 1],
  [bob, 2],
  [alice, 5],
  [bob, 7],
];

export const alicesDrawMove: Move = [alice, 8];

export const aliceWinsMoves: Moves = [
  [alice, 0],
  [bob, 1],
  [alice, 3],
  [bob, 4],
  [alice, 6],
];

export const aliceWinsOnNextMove: Moves = [
  [alice, 0],
  [bob, 1],
  [alice, 3],
  [bob, 4],
];

export const aliceWinningMove: Move = [alice, 6];

export const defaultGame: Game = {
  gameId: defaultGameId,
  size,
  players,
  moves: [
    [alice, 0],
    [bob, 1],
  ],
  status: { kind: "OpenGame", next: alice },
};

export const drawOnNextMoveGame: Game = {
  ...defaultGame,
  moves: aliceDrawOnNextMove,
};

export const drawGame: Game = {
  ...defaultGame,
  moves: [...aliceDrawOnNextMove, alicesDrawMove],
  status: { kind: "DrawGame" },
};

export const winOnNextMoveGame: Game = {
  ...defaultGame,
  moves: aliceWinsOnNextMove,
};

export const aliceWinsGame: Game = {
  ...defaultGame,
  moves: [...aliceWinsOnNextMove, aliceWinningMove],
  status: { kind: "WonGame", winner: [alice, [0, 3, 6]] },
};

export const impossibleGame: Game = {
  ...defaultGame,
  moves: [
    [alice, -1],
    [bob, 1],
  ],
  status: { kind: "DrawGame" },
};
