import { PlayMoveWorkflow, PlayMoveInput, PlayMoveResult } from "model";
import { narrowScenarios } from "test";

interface Scenario {
  name: string;
  workflow: PlayMoveWorkflow;
  input: PlayMoveInput;
  expected: PlayMoveResult;
}

const scenarios = narrowScenarios<Scenario>([
  { name: "game not found" } as any,
  { name: "player not found" } as any,
  { name: "game not found and player not found" } as any,
]);

describe.each(scenarios())("play move: workflow", (scenario) => {
  const { name, workflow, input, expected } = scenario;
  it(name, async () => {
    const runWorkflow = workflow(input);
    const actual = await runWorkflow();
    expect(actual).toEqual(expected);
  });
});
