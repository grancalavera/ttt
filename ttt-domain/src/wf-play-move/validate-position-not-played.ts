import { CreateMoveInput } from "model";
import { InvalidInput, Validation } from "validation";

export const validatePositionNotPlayed = (
  input: CreateMoveInput
): Validation<void, InvalidInput<CreateMoveInput>> => {
  throw new Error("validateMoveInsideBoard not implemented");
};
