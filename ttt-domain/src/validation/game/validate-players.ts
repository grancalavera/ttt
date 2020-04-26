import * as v from "validation-result/validation";
import { GameValidation, invalidGame } from "validation/types";
import { Game } from "../../model";

export const validatePlayers = (g: Game): GameValidation => {
  const [p1, p2] = g.players;
  return p1 !== p2 ? v.valid(g) : invalidPlayers(g);
};

export const invalidPlayers = invalidGame("Games cannot contain duplicated players");
