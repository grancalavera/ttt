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
import * as result from "validation-result";
import { Invalid, ValidationResult } from "validation-result";
import { validatePlayersInMoves } from "./validate-players-in-moves";

interface Scenario {
  name: string;
  game: Game;
  resolvers: Array<(g: Game) => ValidationResult<Invalid>>;
}

const scenarios = narrowScenarios<Scenario>([
  {
    name: "trivially valid players in moves",
    game: {
      ...game,
      moves: [
        [alice, 0],
        [bob, 1],
      ],
    },
    resolvers: [result.valid],
  },
  {
    name: "1 invalid unique player in moves",
    game: { ...game, moves: [[chris, 0]] },
    resolvers: [result.invalidPlayersInMoves],
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
    resolvers: [result.invalidPlayersInMoves],
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
    resolvers: [result.invalidPlayersInMoves],
  },
]);

describe.each(scenarios())("players in moves validation", (scenario) => {
  const { name, game, resolvers } = scenario;
  const expected = result.combine(resolvers.map((r) => r(game)));

  it(validationLabel(name, result.isValid(expected)), () => {
    const actual = validatePlayersInMoves(game);
    expect(actual).toEqual(expected);
  });
});
