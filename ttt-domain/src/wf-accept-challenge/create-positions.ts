import { CreateGameInput, Position, arePositionsTheSame } from "model";
import { invalidInput, InvalidInput, Validation, valid } from "validation";

export const createPositions = (
  input: CreateGameInput
): Validation<[Position, Position], InvalidInput<CreateGameInput>> => {
  const {
    challenge: { position: challengerPosition },
    position: opponentPosition,
  } = input;

  const positions: [Position, Position] = [challengerPosition, opponentPosition];
  return arePositionsTheSame(positions) ? invalidPositions(input) : valid(positions);
};

export const invalidPositions = invalidInput(
  "A challenge can not be accepted using a position already played in the challenge"
);
