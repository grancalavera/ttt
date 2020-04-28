import { validations } from "validation";
import {
  validateMoves,
  validatePlayers,
  validatePlayersInMoves,
} from "validate-game/game";

export const validateGame = validations([
  validatePlayers,
  validatePlayersInMoves,
  validateMoves,
]);
