import { Game, Move } from "model";
import { InvalidInput, ValidateInput, Validation } from "validation";

export type MoveValidation = Validation<MoveInput, InvalidMove>;
export type InvalidMove = InvalidInput<MoveInput>;

export interface MoveInput {
  game: Game;
  move: Move;
}
export type ValidateMove = ValidateInput<MoveInput>;

export class MoveValidationError extends Error {
  constructor(message: string, readonly validationResult: MoveValidation) {
    super(message);
  }
}
