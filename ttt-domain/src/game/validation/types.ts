import { Game } from "model";
import { InvalidInput, ValidateInput, Validation } from "validation";

export type GameValidation = Validation<Game, InvalidGame>;
export type InvalidGame = InvalidInput<Game>;

export type ValidateGame = ValidateInput<Game>;

export class GameValidationError extends Error {
  constructor(message: string, readonly validationResult: GameValidation) {
    super(message);
  }
}
