import { narrowScenarios } from "test";
import { combine } from "validation-result/combine";
import { invalidContinuity, invalidUniqueness } from "./results";
import { InvalidMoves, ValidationResult } from "./types";

interface Scenario {
  name: string;
  results: ValidationResult<InvalidMoves>[];
  expected: ValidationResult<InvalidMoves>;
}

const scenarios = narrowScenarios<Scenario>([
  { name: "single valid result", results: [[]], expected: [] },
  { name: "two valid results", results: [[], []], expected: [] },
  {
    name: "two unique invalid results",
    results: [invalidUniqueness(0, []), invalidContinuity(0, [])],
    expected: [...invalidUniqueness(0, []), ...invalidContinuity(0, [])],
  },
  {
    name: "two duplicated invalid results",
    results: [invalidUniqueness(0, []), invalidUniqueness(0, [])],
    expected: [...invalidUniqueness(0, [])],
  },
]);

describe.each(scenarios())("combine validation results", (scenario) => {
  const { name, results, expected } = scenario;

  it(name, () => {
    const actual = combine(results);
    expect(actual).toEqual(expected);
  });
});
