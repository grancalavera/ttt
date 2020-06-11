import { CreateGameInput, Game } from "model";
import { InvalidInput, Validation } from "validation";

export const createGame = (
  input: CreateGameInput
): Validation<Game, InvalidInput<CreateGameInput>[]> => {
  throw new Error("createGame not implemented");
};
