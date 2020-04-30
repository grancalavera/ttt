import { invalidInput, valid, validations } from "validation";
import { ValidateMove, MoveInput } from "./types";

const validateNotPlayed: ValidateMove = (input) => {
  const { moves, position } = moveInput(input);
  const played = moves.map((m) => m[1]).includes(position);
  return !played ? valid(input) : invalidMoveAlreadyPlayed(input);
};

const validateMoveInsideRange: ValidateMove = (input) => {
  const { size, position } = moveInput(input);
  const inRange = 0 <= position && position < size * size;
  return inRange ? valid(input) : invalidMoveOutOfRange(input);
};

export const validatePosition = validations([validateNotPlayed, validateMoveInsideRange]);

export const invalidMoveAlreadyPlayed = invalidInput("Move has been already played");
export const invalidMoveOutOfRange = invalidInput("Move out of range");

const moveInput = ({ game: { moves, size }, move: [_, position] }: MoveInput) => ({
  moves,
  size,
  position,
});
