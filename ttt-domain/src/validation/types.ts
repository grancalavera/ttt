import { Game, Move } from "model";
import { InvalidInput, ValidateInput, Validation } from "validation-result";

export type GameValidation = Validation<Game, InvalidInput<Game>>;
export type MoveValidation = Validation<MoveInput, InvalidInput<MoveInput>>;

export interface MoveInput {
  game: Game;
  move: Move;
}
export type ValidateMove = ValidateInput<MoveInput>;
export type ValidateGame = ValidateInput<Game>;

export class GameValidationError extends Error {
  constructor(message: string, readonly validationResult: GameValidation) {
    super(message);
  }
}
