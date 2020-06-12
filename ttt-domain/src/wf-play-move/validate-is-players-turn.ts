import { CreateMoveInput } from "model";
import { InvalidInput, Validation } from "validation";

export const validateIsPlayersTurn = (
  input: CreateMoveInput
): Validation<void, InvalidInput<CreateMoveInput>> => {
  throw new Error("validateIsPlayerTurn not implemented");
};
