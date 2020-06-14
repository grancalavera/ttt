import { Move, Winner } from "model";
import { narrowScenarios, alice, bob } from "test";
import { findWinners } from "./winners";
import { chris } from "test/players";

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
  {
    name: "an illegal case: three winners",
    moves: [
      [alice, 0],
      [alice, 1],
      [alice, 2],
      [bob, 3],
      [bob, 4],
      [bob, 5],
      [chris, 6],
      [chris, 7],
      [chris, 8],
    ],
    size: 3,
    expected: [
      [alice, [0, 1, 2]],
      [bob, [3, 4, 5]],
      [chris, [6, 7, 8]],
    ],
  },
]);

describe.each(scenarios())("states", (scenario) => {
  const { name, moves, size, expected } = scenario;

  it(name, () => {
    const actual = findWinners(size, moves);
    expect(actual).toEqual(expected);
  });
});
