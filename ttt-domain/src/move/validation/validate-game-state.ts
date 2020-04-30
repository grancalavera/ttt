import { isOpen } from "game";
import { invalidInput, valid } from "validation";
import { MoveInput, ValidateMove } from "./types";

export const validateGameState = (input: MoveInput): any => {
  return isOpen(input.game) ? valid(input) : invalidMoveGameOver(input);
};

export const invalidMoveGameOver: ValidateMove = invalidInput(
  "Current game is over and cannot take more moves"
);
