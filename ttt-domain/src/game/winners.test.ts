import { Move, Winner } from "model";
import { narrowScenarios, alice } from "test";
import { winners } from "./winners";

const size = 3;

interface Scenario {
  name: string;
  moves: Move[];
  size: number;
  expected: Winner[];
}

const scenarios = narrowScenarios<Scenario>([
  { name: "no moves implies no winners", moves: [], size: 3, expected: [] },
  {
    name: "one winner",
    moves: [
      [alice, 0],
      [alice, 1],
      [alice, 2],
    ],
    size: 3,
    expected: [[alice, [0, 1, 2]]],
  },
  {
    name: "one winner out of order",
    moves: [
      [alice, 1],
      [alice, 0],
      [alice, 2],
    ],
    size: 3,
    expected: [[alice, [0, 1, 2]]],
  },
  {
    name: "one winner reverse order",
    moves: [
      [alice, 2],
      [alice, 1],
      [alice, 0],
    ],
    size: 3,
    expected: [[alice, [0, 1, 2]]],
  },
]);

describe.each(scenarios(1, 2))("states", (scenario) => {
  const { name, moves, size, expected } = scenario;

  it(name, () => {
    const actual = winners(size, moves);
    expect(actual).toEqual(expected);
  });
});
