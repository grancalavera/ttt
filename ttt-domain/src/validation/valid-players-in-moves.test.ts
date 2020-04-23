import { Game } from "model";
import {
  alice,
  bob,
  chris,
  dave,
  narrowScenarios,
  trivialGame as game,
  validationLabel,
} from "test";
import {
  invalidPlayersInMoves,
  isValid,
  valid,
  ValidationResult,
} from "validation-result";
import { InvalidGame } from "validation-result/types";
import { validPlayersInMoves } from "./valid-players-in-moves";

export interface Scenario {
  name: string;
  game: Game;
  resolve: (game: Game) => ValidationResult<InvalidGame>;
}

const scenarios = narrowScenarios<Scenario>([
  {
    name: "trivial game",
    game,
    resolve: valid,
  },
  {
    name: "trivially valid players in moves",
    game: {
      ...game,
      moves: [
        [alice, 0],
        [bob, 1],
      ],
    },
    resolve: valid,
  },
  {
    name: "1 invalid unique player in moves",
    game: { ...game, moves: [[chris, 0]] },
    resolve: invalidPlayersInMoves,
  },
  {
    name: "2 invalid unique player in moves",
    game: {
      ...game,
      moves: [
        [chris, 0],
        [dave, 1],
      ],
    },
    resolve: invalidPlayersInMoves,
  },
  {
    name: "2 invalid duplicated players in moves",
    game: {
      ...game,
      moves: [
        [chris, 0],
        [dave, 1],
        [chris, 2],
        [dave, 3],
      ],
    },
    resolve: invalidPlayersInMoves,
  },
]);

describe.each(scenarios(0, 5))("valid players in moves", (scenario) => {
  const { name, game, resolve } = scenario;
  const expected = resolve(game);

  it(validationLabel(name, isValid(expected)), () => {
    const actual = validPlayersInMoves(game);
    expect(actual).toEqual(expected);
  });
});
