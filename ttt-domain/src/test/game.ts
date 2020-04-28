import { ValidateGame } from "game/validation/types";
import { Game } from "model";
import { alice, bob } from "./players";

export const trivialGame: Game = {
  size: 3,
  players: [alice, bob],
  moves: [],
};

export interface GameScenario {
  name: string;
  game: Game;
  toValidation: ValidateGame;
}
