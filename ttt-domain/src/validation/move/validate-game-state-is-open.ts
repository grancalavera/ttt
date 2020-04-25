import { Game } from "model";
import { ValidationResult, InvalidGame } from "validation-result";

export const validateGameStateIsOpen = (g: Game): ValidationResult<InvalidGame> => {
  throw new Error("not implemented");
};
