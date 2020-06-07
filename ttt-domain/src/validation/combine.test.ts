import { narrowScenarios } from "test";
import { combine } from "./combine";
import { invalid, valid, Validation } from "./core";

interface Scenario {
  name: string;
  results: Validation<string, string[]>[];
  expected: Validation<string, string[]>;
}

const scenarios = narrowScenarios<Scenario>([
  { name: "empty", results: [], expected: invalid([]) },
  {
    name: "one valid",
    results: [valid("valid")],
    expected: valid("valid"),
  },
  {
    name: "two valid",
    results: [valid("first"), valid("second")],
    expected: valid("second"),
  },
  {
    name: "one invalid",
    results: [invalid(["error"])],
    expected: invalid(["error"]),
  },
  {
    name: "two invalid",
    results: [invalid(["first"]), invalid(["second"])],
    expected: invalid(["first", "second"]),
  },
  {
    name: "first valid second invalid",
    results: [valid("first"), invalid(["second"])],
    expected: invalid(["second"]),
  },
  {
    name: "first invalid second valid",
    results: [invalid(["first"]), valid("second")],
    expected: invalid(["first"]),
  },
  {
    name: "invalid, valid, invalid",
    results: [invalid(["first"]), valid("second"), invalid(["third"])],
    expected: invalid(["first", "third"]),
  },
  {
    name: "flatten invalid",
    results: [invalid(["first"]), invalid(["second", "third"])],
    expected: invalid(["first", "second", "third"]),
  },
]);

describe.each(scenarios())("combining validation results", (scenario) => {
  const { name, results, expected } = scenario;
  it(name, () => {
    const actual = combine(results);
    expect(actual).toEqual(expected);
  });
});
