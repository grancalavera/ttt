import { CreateMoveInput } from "model";
import {
  failWithInvalidInput,
  InvalidInput,
  invalidInput,
  Validation,
  allow,
} from "validation";

export const validatePositionNotPlayed = (
  input: CreateMoveInput
): Validation<void, InvalidInput<CreateMoveInput>> => {
  const neverPlayed = input.game.moves.every(
    ([_, candidate]) => input.playerPosition !== candidate
  );

  return neverPlayed ? allow : failWithInvalidPosition(input);
};

export const invalidPosition = invalidInput(
  "can't play a position that has already been played"
);
export const failWithInvalidPosition = failWithInvalidInput(invalidPosition);
