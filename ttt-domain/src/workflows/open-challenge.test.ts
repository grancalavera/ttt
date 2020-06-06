import { OpenChallengeInput, OpenChallengeResult } from "model";
import { Async } from "result";
import { alice, bob, uniqueIdProducerMock } from "test";
import { openChallenge } from "./open-challenge";
import { toChallenger } from "test/players";

interface Scenario {
  name: string;
  workflow: (input: OpenChallengeInput) => Async<OpenChallengeResult>;
  input: OpenChallengeInput;
  expected: OpenChallengeResult;
}

const failureWorkflow = openChallenge({
  findChallenger: (challengerId) => async () => ({
    kind: "Failure",
    error: { kind: "ChallengerNotFoundError", challengerId },
  }),
  ...uniqueIdProducerMock,
});

const successWorkflow = openChallenge({
  findChallenger: (challengerId) => async () => ({
    kind: "Success",
    value: { challengerId },
  }),
  ...uniqueIdProducerMock,
});

const scenarios: Scenario[] = [
  {
    name: `Challenger ${alice} not found`,
    workflow: failureWorkflow,
    input: { challengerId: alice.playerId, position: 0 },
    expected: {
      kind: "Failure",
      error: { kind: "ChallengerNotFoundError", challengerId: alice.playerId },
    },
  },
  {
    name: `Challenger ${bob} not found`,
    workflow: failureWorkflow,
    input: { challengerId: bob.playerId, position: 0 },
    expected: {
      kind: "Failure",
      error: { kind: "ChallengerNotFoundError", challengerId: bob.playerId },
    },
  },
  {
    name: `Challenger ${alice} found`,
    workflow: successWorkflow,
    input: { challengerId: alice.playerId, position: 0 },
    expected: {
      kind: "Success",
      value: {
        challengeId: uniqueIdProducerMock.getUniqueId(),
        challenger: toChallenger(alice),
        position: 0,
      },
    },
  },
  {
    name: `Challenger ${bob} found`,
    workflow: successWorkflow,
    input: { challengerId: bob.playerId, position: 0 },
    expected: {
      kind: "Success",
      value: {
        challengeId: uniqueIdProducerMock.getUniqueId(),
        challenger: toChallenger(bob),
        position: 0,
      },
    },
  },
];

describe.each(scenarios)("Open Challenge", (scenario) => {
  const { workflow, expected, name, input } = scenario;
  it(name, async () => {
    const runWorkflow = workflow(input);
    const actual = await runWorkflow();
    expect(actual).toEqual(expected);
  });
});
