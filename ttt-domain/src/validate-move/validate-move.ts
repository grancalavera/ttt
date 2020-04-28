import { invalidInput } from "validation";
import { ValidateMove } from "./types";

export const validateMove: ValidateMove = (input) => {
  throw new Error("validateMove: not fully implemented");

  // return result.combine<Invalid>([
  //   validatePlayerExistsInGame(g.players, m[0]),
  //   validatePosition(g, m[1]),
  //   validateGameStateIsOpen(g),
  // ]);
};

export const moveOnInvalidGame: ValidateMove = invalidInput(
  "Move on invalid game: Cannot play a move on an invalid game"
);
