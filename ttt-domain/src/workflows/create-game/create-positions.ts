import { Position } from "../../domain/model";
import {
  failWithInvalidInput,
  InvalidInput,
  invalidInput,
  valid,
  Validation,
} from "../../../../ttt-etc/dist";
import { CreateGameInput } from "./workflow";

export const createPositions = (
  input: CreateGameInput
): Validation<[Position, Position], InvalidInput<CreateGameInput>> => {
  const {
    challenge: { challengerPosition },
    opponentPosition,
  } = input;

  return challengerPosition === opponentPosition
    ? failWithInvalidPositions(input)
    : valid([challengerPosition, opponentPosition]);
};

export const invalidPositions = invalidInput(
  "A challenge can not be accepted using a position already played in the challenge"
);

export const failWithInvalidPositions = failWithInvalidInput(invalidPositions);