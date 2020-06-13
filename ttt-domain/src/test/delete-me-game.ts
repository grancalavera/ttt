import { ValidateGame } from "game/validation";
import { Game, Moves, Players } from "model";
import { alice, bob } from "./players";
import { defaultGameId } from "./unique-id";

const size = 3;
const players: Players = [alice, bob];

export const drawMoves: Moves = [
  [alice, 0],
  [bob, 3],
  [alice, 6],
  [bob, 4],
  [alice, 1],
  [bob, 2],
  [alice, 5],
  [bob, 7],
  [alice, 8],
];

export const aliceWinsMoves: Moves = [
  [alice, 0],
  [bob, 1],
  [alice, 3],
  [bob, 4],
  [alice, 6],
];

export const game: Game = {
  gameId: defaultGameId,
  size,
  players,
  moves: [
    [alice, 0],
    [bob, 1],
  ],
  status: { kind: "OpenGame", next: players[0] },
};

export const draw: Game = {
  gameId: defaultGameId,
  size,
  players,
  moves: drawMoves,
  status: { kind: "DrawGame" },
};

export const aliceWins: Game = {
  gameId: defaultGameId,
  size,
  players,
  moves: aliceWinsMoves,
  status: { kind: "WonGame", winner: [alice, [0, 3, 6]] },
};

export interface GameScenario {
  name: string;
  input: Game;
  toValidation: ValidateGame;
}
