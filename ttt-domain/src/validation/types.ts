import { Game, Move } from "model";
import * as v from "validation-result/validation";

export type GameValidation = v.Validation<Game, InvalidGame>;
export type MoveValidation = v.Validation<Move, InvalidMove>;
export type ValidateGame = (g: Game) => GameValidation;

export interface InvalidGame {
  message: string;
  game: Game;
}

export interface InvalidMove {
  message: string;
  game: Game;
  move: Move;
}

export const invalidGame = (message: string) => (game: Game): GameValidation =>
  v.invalid({ message, game });

export const invalidMove = (message: string) => (
  game: Game,
  move: Move
): MoveValidation => v.invalid({ message, game, move });

export const validateMany = (validations: ValidateGame[]) => (g: Game): GameValidation =>
  v.combine(validations.map((v: ValidateGame) => v(g)));

export class GameValidationError extends Error {
  constructor(message: string, readonly validationResult: GameValidation) {
    super(message);
  }
}
