import { CreateMoveInput } from "model";
import { InvalidInput, Validation } from "validation";

export const validateGameStatus = (
  input: CreateMoveInput
): Validation<void, InvalidInput<CreateMoveInput>> => {
  throw new Error("validateGameStatus not implemented");
};
