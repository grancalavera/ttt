import { Game, Move } from "model";
import * as v from "validation-result/validation";
import { invalidMove, MoveValidation } from "./types";
import { validateGame } from "./validate-game";

export const validateMove = (g: Game, m: Move): MoveValidation => {
  const gameValidationResult = validateGame(g);

  if (!v.isValid(gameValidationResult)) {
    return moveOnInvalidGame(g, m);
  }

  throw new Error("validateMove: not fully implemented");

  // return result.combine<Invalid>([
  //   validatePlayerExistsInGame(g.players, m[0]),
  //   validatePosition(g, m[1]),
  //   validateGameStateIsOpen(g),
  // ]);
};

export const moveOnInvalidGame = invalidMove(
  "Move on invalid game: Cannot play a move on an invalid game"
);
