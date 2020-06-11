import { CreateGameInput, Position } from "model";
import { invalidInput, InvalidInput, Validation } from "validation";

export const createPositions = (
  input: CreateGameInput
): Validation<Position[], InvalidInput<CreateGameInput>> => {
  throw new Error("createPositions not implemented");
};

export const invalidPositions = invalidInput(
  "A challenge can not be accepted using a position already played in the challenge"
);
