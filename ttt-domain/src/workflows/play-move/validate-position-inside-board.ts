import {
  allow,
  failWithInvalidInput,
  InvalidInput,
  invalidInput,
  Validation,
} from "@grancalavera/ttt-etc";
import { CreateMoveInput } from "./workflow";

export const validatePositionInsideBoard = (
  input: CreateMoveInput
): Validation<void, InvalidInput<CreateMoveInput>> => {
  const {
    playerPosition,
    game: { size },
  } = input;

  const lowerBound = -1;
  const upperBound = size * size;
  const insideBoard = lowerBound < playerPosition && playerPosition < upperBound;

  return insideBoard ? allow : failWithInvalidPositionOutsideBoard(input);
};

export const invalidPositionOutsideBoard = invalidInput(
  "can't play a position outside the board"
);
export const failWithInvalidPositionOutsideBoard = failWithInvalidInput(
  invalidPositionOutsideBoard
);