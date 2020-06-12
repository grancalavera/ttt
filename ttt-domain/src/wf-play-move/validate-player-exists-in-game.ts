import { CreateMoveInput } from "model";
import { InvalidInput, Validation } from "validation";

export const validatePlayerExistsInGame = (
  input: CreateMoveInput
): Validation<void, InvalidInput<CreateMoveInput>> => {
  throw new Error("validatePlayerExistsInGame not implemented");
};
