import { CreateMoveInput } from "model";
import {
  InvalidInput,
  Validation,
  invalidInput,
  failWithInvalidInput,
  allow,
} from "validation";

export const validateGameStatusIsOpen = (
  input: CreateMoveInput
): Validation<void, InvalidInput<CreateMoveInput>> => {
  return input.game.status.kind === "OpenGame" ? allow : failWithInvalidGameStatus(input);
};

export const invalidGameStatus = invalidInput(
  'A move can only be played on a game with status "OpenGame"'
);

export const failWithInvalidGameStatus = failWithInvalidInput(invalidGameStatus);
