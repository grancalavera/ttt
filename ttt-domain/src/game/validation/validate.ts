import { validations } from "validation";
import { validatePlayers } from "./validate-players";
import { validatePlayersInMoves } from "./validate-players-in-moves";
import { validateMoves } from "./validate-moves";

export const validate = validations([
  validatePlayers,
  validatePlayersInMoves,
  validateMoves,
]);
