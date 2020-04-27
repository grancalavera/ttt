import { Game, Move } from "model";
import * as v from "validation-result/validation";

export type GameValidation = v.Validation<Game, InvalidGame>;
export type MoveValidation = v.Validation<Move, InvalidMove>;
export type ValidateGame = ValidateInput<Game>;

export type ValidateInput<Input> = (
  input: Input
) => v.Validation<Input, InvalidInput<Input>>;

export const validations = <Input extends unknown>(
  validations: ValidateInput<Input>[]
) => (input: Input): v.Validation<Input, InvalidInput<Input>> => {
  return v.combine(validations.map((v: ValidateInput<Input>) => v(input)));
};

export interface InvalidInput<T> {
  message: string;
  input: T;
}

export type InvalidGame = InvalidInput<Game>;
export type InvalidMove = InvalidInput<{ game: Game; move: Move }>;

export const invalidGame = (message: string) => (input: Game): GameValidation =>
  v.invalid({ message, input });

export const invalidMove = (message: string) => (input: {
  game: Game;
  move: Move;
}): MoveValidation => v.invalid({ message, input });

export class GameValidationError extends Error {
  constructor(message: string, readonly validationResult: GameValidation) {
    super(message);
  }
}
