import { validateMoves, validatePlayers, validatePlayersInMoves } from "validation/game";
import { validateMany } from "./types";

export const validateGame = validateMany([
  validatePlayers,
  validatePlayersInMoves,
  validateMoves,
]);
