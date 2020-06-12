import { CreateMoveInput } from "model";
import { InvalidInput, Validation } from "validation";

export const validatePositionInsideBoard = (
  input: CreateMoveInput
): Validation<void, InvalidInput<CreateMoveInput>> => {
  throw new Error("validatePositionNotPlayers not implemented");
};
