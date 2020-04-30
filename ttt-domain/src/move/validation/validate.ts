import { validations } from "validation";
import { validatePlayer } from "./validate-player";
import { validateGameState } from "./validate-game-state";
import { validatePosition } from "./validate-position";

export const validate = validations([
  validateGameState,
  validatePlayer,
  validatePosition,
]);
