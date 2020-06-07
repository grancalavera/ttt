import { Game, Move } from "model";
import { invalid, InvalidInput, Validation } from "validation";

export interface MoveInput {
  game: Game;
  move: Move;
}

export type ValidateMove = (
  input: MoveInput
) => Validation<MoveInput, InvalidInput<MoveInput>[]>;

export const invalidMoveInput = (message: string) => (
  input: MoveInput
): Validation<never, InvalidInput<MoveInput>[]> => {
  const invalidInput: InvalidInput<MoveInput> = {
    message,
    input,
  };
  return invalid([invalidInput]);
};
