import { validateMoves, validatePlayers, validatePlayersInMoves } from "validation/game";
import { validations } from "./types";

export const validateGame = validations([
  validatePlayers,
  validatePlayersInMoves,
  validateMoves,
]);
