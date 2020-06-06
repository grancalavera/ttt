import * as game from "game";
import * as move from "move";
import { ValidateMove } from "move";
import { invalidInput, isInvalid } from "validation";

export const validateMove: ValidateMove = (input) =>
  isInvalid(game.validate(input.game))
    ? invalidMoveOnInvalidGame(input)
    : move.validate(input);

const invalidMoveOnInvalidGame: ValidateMove = invalidInput(
  "Cannot play move on an invalid game"
);
