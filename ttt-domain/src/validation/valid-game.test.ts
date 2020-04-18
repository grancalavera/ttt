import { Game } from "model";
import { alice, bob, chris, narrowScenarios, validationLabel } from "test";
import { validGame } from "validation";

interface Scenario {
  name: string;
  game: Game;
  expected: boolean;
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
    expected: true,
  },
  {
    name: "smallest non-empty valid game",
    game: {
      players: [alice, bob],
      moves: [[alice, 0]],
      size,
    },
    expected: true,
  },
  {
    name: "unknown player",
    game: {
      players: [alice, bob],
      size,
      moves: [[chris, 0]],
    },
    expected: false,
  },
]);

describe.each(scenarios())("game validation", (scenario) => {
  const { name, game, expected } = scenario;
  it(validationLabel(name, expected), () => {
    const actual = validGame(game);
    expect(actual).toEqual(expected);
  });
});
