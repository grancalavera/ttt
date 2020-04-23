import { Game, Move, Players } from "model";
import {
  InvalidGame,
  InvalidMoves,
  ValidationResult,
  Invalid,
  InvalidPlayers,
} from "./types";

export const valid = <T extends Invalid>(): ValidationResult<T> => [];

export const isValid = <T extends Invalid>(r: ValidationResult<T>): boolean =>
  r.length === 0;

const invalidGame = (message: string) => (game: Game): ValidationResult<InvalidGame> => [
  {
    kind: "InvalidGame",
    message,
    game,
  },
];

const invalidMoves = (message: string) => (
  size: number,
  moves: Move[]
): ValidationResult<InvalidMoves> => [
  {
    kind: "InvalidMoves",
    message,
    size,
    moves,
  },
];

export const invalidPlayers = (players: Players): ValidationResult<InvalidPlayers> => [
  {
    kind: "InvalidPlayers",
    message: "Invalid Players",
    players,
  },
];

export const invalidPlayersInMoves = invalidGame(
  "Some players in moves do not belong to this game"
);

export const invalidContinuity = invalidMoves("Some players played consecutive moves");
export const invalidUniqueness = invalidMoves(
  "Some positions have been played more than once"
);
export const invalidRanges = invalidMoves("Some moves are out of range");
export const invalidPlayerCount = invalidMoves("There are more than two (2) players");
export const invalidSingleWinner = invalidMoves("There is more than one (1) winner");
