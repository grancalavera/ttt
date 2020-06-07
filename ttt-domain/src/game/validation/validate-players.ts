import { invalidGameInput, ValidateGame } from "game/validation/types";
import { valid } from "validation";

export const validatePlayers: ValidateGame = (g) => {
  const [p1, p2] = g.players;
  return p1 !== p2 ? valid(g) : invalidPlayers(g);
};

export const invalidPlayers = invalidGameInput("Games cannot contain duplicated players");
