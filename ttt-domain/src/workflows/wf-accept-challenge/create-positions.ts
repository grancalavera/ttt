import { arePositionsTheSame, CreateGameInput, Position } from "../../model";
import {
  failWithInvalidInput,
  InvalidInput,
  invalidInput,
  valid,
  Validation,
} from "../../validation";

export const createPositions = (
  input: CreateGameInput
): Validation<[Position, Position], InvalidInput<CreateGameInput>> => {
  const {
    challenge: { challengerPosition: challengerPosition },
    opponentPosition: opponentPosition,
  } = input;

  const positions: [Position, Position] = [challengerPosition, opponentPosition];
  return arePositionsTheSame(positions)
    ? failWithInvalidPositions(input)
    : valid(positions);
};

export const invalidPositions = invalidInput(
  "A challenge can not be accepted using a position already played in the challenge"
);

export const failWithInvalidPositions = failWithInvalidInput(invalidPositions);
