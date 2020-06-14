import {
  allow,
  failWithInvalidInput,
  InvalidInput,
  invalidInput,
  Validation,
} from "../../validation";
import { CreateMoveInput } from "../play-move";

export const validateGameStatusIsOpen = (
  input: CreateMoveInput
): Validation<void, InvalidInput<CreateMoveInput>> =>
  input.game.status.kind === "OpenGame" ? allow : failWithInvalidGameStatus(input);

export const invalidGameStatus = invalidInput(
  'A move can only be played on a game with status "OpenGame"'
);

export const failWithInvalidGameStatus = failWithInvalidInput(invalidGameStatus);
