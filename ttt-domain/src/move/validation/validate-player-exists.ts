import { invalidInput, valid } from "validation";
import { ValidateMove } from "./types";

export const validatePlayerExists: ValidateMove = (input) => {
  const {
    game: { players },
    move: [player],
  } = input;

  return players.includes(player) ? valid(input) : invalidMovePlayerDoesNotExist(input);
};

export const invalidMovePlayerDoesNotExist: ValidateMove = invalidInput(
  "Player in move does not exist in game"
);
