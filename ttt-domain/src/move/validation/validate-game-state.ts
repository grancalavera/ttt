import { isOpen } from "game";
import { invalidInput, valid } from "validation";
import { ValidateMove } from "./types";

export const validateGameState: ValidateMove = (input) => {
  return isOpen(input.game) ? valid(input) : invalidMoveGameOver(input);
};

export const invalidMoveGameOver: ValidateMove = invalidInput(
  "Current game is over and cannot take more moves"
);
