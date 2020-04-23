import { Game } from "model";
import * as result from "validation-result";
import { Invalid, ValidationResult } from "validation-result";
import { validMoves } from "validation/valid-moves";
import { validPlayers } from "validation/valid-players";
import { validPlayersInMoves } from "validation/valid-players-in-moves";

export const validGame = (g: Game): ValidationResult<Invalid> => {
  const { players, moves, size } = g;
  return result.combine<Invalid>([
    validPlayers(players),
    validMoves(size, moves),
    validPlayersInMoves(g),
  ]);
};
