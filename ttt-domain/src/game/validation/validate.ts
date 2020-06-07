import { validations } from "validation";
import { validateMoves } from "./validate-moves";
import { validatePlayers } from "./validate-players";
import { validatePlayersInMoves } from "./validate-players-in-moves";

export const validate = validations([
  validatePlayers,
  validatePlayersInMoves,
  validateMoves,
]);
