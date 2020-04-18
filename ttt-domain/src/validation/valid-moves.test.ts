import { alice, bob, narrowScenarios, validationLabel } from "test";
import { Move } from "../model";
import { validMoves } from "./valid-moves";
import { chris } from "test/players";

interface Scenario {
  name: string;
  moves: Move[];
  size: number;
  expected: boolean;
}

const size = 3;

const scenarios = narrowScenarios<Scenario>([
  { name: "empty moves", moves: [], size, expected: true },
  {
    name: "consecutive moves",
    moves: [
      [alice, 0],
      [alice, 1],
    ],
    size,
    expected: false,
  },
  {
    name: "consecutive moves",
    moves: [
      [alice, 0],
      [bob, 1],
      [alice, 2],
      [bob, 3],
      [bob, 4],
    ],
    size,
    expected: false,
  },
  {
    name: "duplicated moves",
    moves: [
      [alice, 0],
      [bob, 0],
    ],
    size,
    expected: false,
  },
  {
    name: "moves below range",
    moves: [[alice, -1]],
    size,
    expected: false,
  },
  {
    name: "moves above range",
    moves: [[alice, 9]],
    size,
    expected: false,
  },
  {
    name: "no consecutive moves",
    moves: [
      [alice, 0],
      [bob, 3],
      [alice, 6],
      [bob, 4],
      [alice, 1],
      [bob, 2],
      [alice, 5],
      [bob, 7],
      [alice, 8],
    ],
    size,
    expected: true,
  },
  {
    name: "more than two players",
    moves: [
      [alice, 0],
      [bob, 1],
      [chris, 2],
    ],
    size,
    expected: false,
  },
  {
    name: "multiple winners",
    moves: [
      [alice, 0],
      [bob, 1],
      [alice, 3],
      [bob, 4],
      [alice, 6],
      [bob, 7],
    ],
    size,
    expected: false,
  },
]);

describe.each(scenarios())("validate moves in game", (scenario) => {
  const { name, moves, size, expected } = scenario;
  it(validationLabel(name, expected), () => {
    const actual = validMoves(size, moves);
    expect(actual).toEqual(expected);
  });
});
