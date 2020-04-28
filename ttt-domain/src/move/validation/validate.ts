import { ValidateMove } from "./types";

export const validate: ValidateMove = (input) => {
  throw new Error("validateMove: not fully implemented");

  // return result.combine<Invalid>([
  //   validatePlayerExistsInGame(g.players, m[0]),
  //   validatePosition(g, m[1]),
  //   validateGameStateIsOpen(g),
  // ]);
};
