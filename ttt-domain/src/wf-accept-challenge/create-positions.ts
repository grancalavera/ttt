import { CreateGameInput, Position, SmartConstructor } from "model";
import { invalidInput, valid, InvalidInput } from "validation";

type CreatePositions = SmartConstructor<
  CreateGameInput,
  [Position, Position],
  InvalidInput<CreateGameInput>
>;

export const createPositions: CreatePositions = (input) => {
  throw new Error("createPositions not implemented");
};

export const invalidPositions = invalidInput(
  "A challenge can not be accepted using a position already played in the challenge"
);
