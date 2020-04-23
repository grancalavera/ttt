import { Game } from "model";
import { alice, bob, chris, narrowScenarios, validationLabel } from "test";
import { validGame } from "validation";
import * as result from "validation-result";
import { Invalid, ValidationResult } from "validation-result";

interface Scenario {
  name: string;
  game: Game;
  resolvers: Array<(g: Game) => ValidationResult<Invalid>>;
}

const size = 3;

const scenarios = narrowScenarios<Scenario>([
  {
    name: "trivially valid game",
    game: {
      players: [alice, bob],
      moves: [],
      size,
    },
    resolvers: [result.valid],
  },
  {
    name: "smallest non-empty valid game",
    game: {
      players: [alice, bob],
      moves: [[alice, 0]],
      size,
    },
    resolvers: [result.valid],
  },
  {
    name: "unknown player",
    game: {
      players: [alice, bob],
      size,
      moves: [[chris, 0]],
    },
    resolvers: [result.invalidPlayersInMoves],
  },
]);

describe.each(scenarios())("game validation", (scenario) => {
  const { name, game, resolvers } = scenario;
  const expected = result.combine(resolvers.map((r) => r(game)));

  it(validationLabel(name, result.isValid(expected)), () => {
    const actual = validGame(game);
    expect(actual).toEqual(expected);
  });
});
