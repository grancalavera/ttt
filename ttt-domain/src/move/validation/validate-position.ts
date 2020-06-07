import { valid, validations } from "validation";
import { invalidMoveInput, MoveInput, ValidateMove } from "./types";

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

export const invalidMoveAlreadyPlayed = invalidMoveInput("Move has been already played");
export const invalidMoveOutOfRange = invalidMoveInput("Move out of range");

const moveInput = ({ game: { moves, size }, move: [_, position] }: MoveInput) => ({
  moves,
  size,
  position,
});
