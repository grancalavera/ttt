import { CreateChallengeInput, CreateChallengeResult } from "model";
import { Async } from "result";
import { alice, bob, challengeUniqueIdProducerMock } from "test";
import { openChallenge } from "./create-challenge";
import { toChallenger } from "test/players";

interface Scenario {
  name: string;
  workflow: (input: CreateChallengeInput) => Async<CreateChallengeResult>;
  input: CreateChallengeInput;
  expected: CreateChallengeResult;
}

const failureWorkflow = openChallenge({
  findChallenger: (challengerId) => async () => ({
    kind: "Failure",
    error: { kind: "ChallengerNotFoundError", challengerId },
  }),
  ...challengeUniqueIdProducerMock,
});

const successWorkflow = openChallenge({
  findChallenger: (challengerId) => async () => ({
    kind: "Success",
    value: { challengerId },
  }),
  ...challengeUniqueIdProducerMock,
});

const scenarios: Scenario[] = [
  {
    name: `Challenger ${alice} not found`,
    workflow: failureWorkflow,
    input: { challengerId: alice.playerId, challengerPosition: 0 },
    expected: {
      kind: "Failure",
      error: { kind: "ChallengerNotFoundError", challengerId: alice.playerId },
    },
  },
  {
    name: `Challenger ${bob} not found`,
    workflow: failureWorkflow,
    input: { challengerId: bob.playerId, challengerPosition: 0 },
    expected: {
      kind: "Failure",
      error: { kind: "ChallengerNotFoundError", challengerId: bob.playerId },
    },
  },
  {
    name: `Challenger ${alice} found`,
    workflow: successWorkflow,
    input: { challengerId: alice.playerId, challengerPosition: 0 },
    expected: {
      kind: "Success",
      value: {
        challengeId: challengeUniqueIdProducerMock.getUniqueId(),
        challenger: toChallenger(alice),
        position: 0,
      },
    },
  },
  {
    name: `Challenger ${bob} found`,
    workflow: successWorkflow,
    input: { challengerId: bob.playerId, challengerPosition: 0 },
    expected: {
      kind: "Success",
      value: {
        challengeId: challengeUniqueIdProducerMock.getUniqueId(),
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
