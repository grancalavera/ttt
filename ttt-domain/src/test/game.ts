import { Game } from "model";
import { alice, bob } from "./players";
import { GameValidation } from "validation/types";
import * as v from "validation-result/validation";

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
  v.combine(toValidations.map((f) => f(game)));
