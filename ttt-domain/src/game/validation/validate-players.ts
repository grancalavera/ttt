import { invalidInput, valid } from "validation";
import { GameValidation, ValidateGame } from "game/validation/types";
import { Game } from "../../model";

export const validatePlayers = (g: Game): GameValidation => {
  const [p1, p2] = g.players;
  return p1 !== p2 ? valid(g) : invalidPlayers(g);
};

export const invalidPlayers: ValidateGame = invalidInput(
  "Games cannot contain duplicated players"
);