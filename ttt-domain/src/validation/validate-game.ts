import { validations } from "validation-result";
import { validateMoves, validatePlayers, validatePlayersInMoves } from "validation/game";

export const validateGame = validations([
  validatePlayers,
  validatePlayersInMoves,
  validateMoves,
]);
