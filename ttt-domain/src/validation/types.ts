import { Game, Move } from "model";
import * as v from "validation-result/validation";

export type GameValidation = v.Validation<Game, v.InvalidInput<Game>>;
export type MoveValidation = v.Validation<MoveInput, v.InvalidInput<MoveInput>>;

export interface MoveInput {
  game: Game;
  move: Move;
}
export type ValidateMove = v.ValidateInput<MoveInput>;
export type ValidateGame = v.ValidateInput<Game>;

export class GameValidationError extends Error {
  constructor(message: string, readonly validationResult: GameValidation) {
    super(message);
  }
}
