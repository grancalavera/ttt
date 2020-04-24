import { alice, bob, chris, narrowScenarios, validationLabel } from "test";
import * as result from "validation-result";
import { ValidationResult } from "validation-result";
import { InvalidMoves } from "validation-result/types";
import { Move } from "../model";
import { validateMoves } from "./validate-moves";

interface Scenario {
  name: string;
  moves: Move[];
  size: number;
  resolvers: Array<(size: number, moves: Move[]) => ValidationResult<InvalidMoves>>;
}

const size = 3;

const scenarios = narrowScenarios<Scenario>([
  { name: "empty moves", moves: [], size, resolvers: [result.valid] },
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
    resolvers: [result.valid],
  },
  {
    name: "consecutive moves",
    moves: [
      [alice, 0],
      [alice, 1],
    ],
    size,
    resolvers: [result.invalidContinuity],
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
    resolvers: [result.invalidContinuity],
  },
  {
    name: "duplicated moves",
    moves: [
      [alice, 0],
      [bob, 0],
    ],
    size,
    resolvers: [result.invalidUniqueness],
  },
  {
    name: "moves below range",
    moves: [[alice, -1]],
    size,
    resolvers: [result.invalidRanges],
  },
  {
    name: "moves above range",
    moves: [[alice, 9]],
    size,
    resolvers: [result.invalidRanges],
  },
  {
    name: "more than two players",
    moves: [
      [alice, 0],
      [bob, 1],
      [chris, 2],
    ],
    size,
    resolvers: [result.invalidPlayerCount],
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
    resolvers: [result.invalidSingleWinner],
  },
  {
    name: "every invalid result",
    moves: [
      [alice, 0],
      [alice, 2],
      [alice, 1],
      [bob, 3],
      [bob, 4],
      [bob, 5],
      [chris, 0],
      [alice, -1],
    ],
    size: 3,
    resolvers: [
      result.invalidContinuity,
      result.invalidUniqueness,
      result.invalidRanges,
      result.invalidPlayerCount,
      result.invalidSingleWinner,
    ],
  },
]);

describe.each(scenarios())("validate moves in game", (scenario) => {
  const { name, moves, size, resolvers } = scenario;

  const expected = result.combine(resolvers.map((r) => r(size, moves)));

  it(validationLabel(name, result.isValid(expected)), () => {
    const actual = validateMoves(size, moves);
    expect(actual).toEqual(expected);
  });
});
