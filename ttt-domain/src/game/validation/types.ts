import { Game } from "model";
import { invalid, InvalidInput, Validation } from "validation";

export type GameValidation = Validation<Game, InvalidGame>;
export type InvalidGame = InvalidInput<Game>;

export class GameValidationError extends Error {
  constructor(message: string, readonly validationResult: GameValidation) {
    super(message);
  }
}

export type ValidateGame = (g: Game) => Validation<Game, InvalidInput<Game>[]>;

export const invalidGameInput = (message: string) => (
  input: Game
): Validation<never, InvalidInput<Game>[]> => {
  const invalidInput: InvalidInput<Game> = {
    message,
    input,
  };
  return invalid([invalidInput]);
};
