import { Game, Move } from "model";
import * as result from "validation-result";
import { Invalid, ValidationResult } from "validation-result";
import {
  validatePlayerExistsInGame,
  validatePosition,
  validateGameStateIsOpen,
} from "validation/move";
import { validateGame } from "./validate-game";

export const validateMove = (g: Game, m: Move): ValidationResult<Invalid> => {
  const gameValidationResult = validateGame(g);

  if (!result.isValid(gameValidationResult)) {
    return gameValidationResult;
  }

  return result.combine<Invalid>([
    validatePlayerExistsInGame(g, m[0]),
    validatePosition(g, m[1]),
    validateGameStateIsOpen(g),
  ]);
};
