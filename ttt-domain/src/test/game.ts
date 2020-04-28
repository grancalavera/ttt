import { Game } from "model";
import { combine } from "validation";
import { GameValidation } from "validate-game/types";
import { alice, bob } from "./players";

export const trivialGame: Game = {
  size: 3,
  players: [alice, bob],
  moves: [],
};

type ToValidation = (g: Game) => GameValidation;
type ToCombinedValidation = (toValidations: ToValidation[]) => ToValidation;

export interface GameScenario {
  name: string;
  game: Game;
  toValidation: ToValidation;
}

export const toCombinedValidation: ToCombinedValidation = (toValidations) => (game) =>
  combine(toValidations.map((f) => f(game)));
