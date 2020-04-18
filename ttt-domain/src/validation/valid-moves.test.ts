import { Move, Player } from "../model";
import { should } from "./should";
import { show } from "./show";
import { validMoves } from "./valid-moves";

const alice: Player = "alice";
const bob: Player = "bob";

interface Scenario {
  name: string;
  moves: Move[];
  expected: boolean;
}

const scenarios: Scenario[] = [
  { name: "empty moves", moves: [], expected: true },
  {
    name: "consecutive moves",
    moves: [
      [alice, 0],
      [alice, 1]
    ],
    expected: false
  },
  {
    name: "consecutive moves",
    moves: [
      [alice, 0],
      [bob, 1],
      [alice, 2],
      [bob, 3],
      [bob, 4]
    ],
    expected: false
  },
  {
    name: "duplicated moves",
    moves: [
      [alice, 0],
      [bob, 0]
    ],
    expected: false
  },
  {
    name: "no duplicates and no consecutive moves",
    moves: [
      [alice, 0],
      [bob, 1],
      [alice, 2],
      [bob, 3],
      [alice, 4],
      [bob, 5],
      [alice, 6],
      [bob, 7],
      [alice, 8]
    ],
    expected: true
  },
  {
    name: "multiple winners",
    moves: [
      [alice, 0],
      [bob, 1],
      [alice, 3],
      [bob, 4],
      [alice, 6],
      [bob, 7]
    ],
    expected: false
  }
];

describe.each(scenarios)("validate moves in game", scenario => {
  const { name, moves, expected } = scenario;
  it(`${name} ${should(expected)} be valid`, () => {
    const actual = validMoves(moves);
    expect(actual).toEqual(expected);
  });
});
