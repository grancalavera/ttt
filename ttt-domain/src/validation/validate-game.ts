import { Game } from "model";
import * as result from "validation-result";
import { Invalid, ValidationResult } from "validation-result";
import { validatePlayersInMoves, validatePlayers, validateMoves } from "validation/game";

export const validateGame = (g: Game): ValidationResult<Invalid> =>
  result.combine<Invalid>([
    validatePlayers(g.players),
    validateMoves(g.size, g.moves),
    validatePlayersInMoves(g),
  ]);
