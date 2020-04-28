import { invalidInput, isValid } from "validation-result";
import { ValidateMove } from "./types";
import { validateGame } from "./validate-game";

export const validateMove: ValidateMove = (input) => {
  const { game } = input;
  const gameValidationResult = validateGame(game);

  if (!isValid(gameValidationResult)) {
    return moveOnInvalidGame(input);
  }

  throw new Error("validateMove: not fully implemented");

  // return result.combine<Invalid>([
  //   validatePlayerExistsInGame(g.players, m[0]),
  //   validatePosition(g, m[1]),
  //   validateGameStateIsOpen(g),
  // ]);
};

export const moveOnInvalidGame: ValidateMove = invalidInput(
  "Move on invalid game: Cannot play a move on an invalid game"
);
