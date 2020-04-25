import { Game, Position } from "model";
import { InvalidMove, ValidationResult } from "validation-result";

export const validatePosition = (
  game: Game,
  position: Position
): ValidationResult<InvalidMove> => {
  throw new Error("not implemented");
};
