import {
  ChallengerFinder,
  CreateChallengeInput,
  CreateChallengeResult,
  CreateChallengeWorkflow,
} from "model";
import { alice, challengeUniqueIdProducerMock, narrowScenarios } from "test";
import { toChallenger } from "test/players";
import { createChallenge } from "./create-challenge";

interface Scenario {
  name: string;
  workflow: CreateChallengeWorkflow;
  input: CreateChallengeInput;
  expected: CreateChallengeResult;
}

const neverFindChallenger: ChallengerFinder = {
  findChallenger: (challengerId) => async () => ({
    kind: "Failure",
    error: { kind: "ChallengerNotFoundError", challengerId },
  }),
};

const alwaysFindAliceAsChallenger: ChallengerFinder = {
  findChallenger: () => async () => ({
    kind: "Success",
    value: toChallenger(alice),
  }),
};

const scenarios = narrowScenarios<Scenario>([
  {
    name: "Challenger not found",
    workflow: createChallenge({
      ...neverFindChallenger,
      ...challengeUniqueIdProducerMock,
    }),
    input: { challengerId: alice.playerId, challengerPosition: 0 },
    expected: {
      kind: "Failure",
      error: { kind: "ChallengerNotFoundError", challengerId: alice.playerId },
    },
  },
  {
    name: `Challenger found`,
    workflow: createChallenge({
      ...alwaysFindAliceAsChallenger,
      ...challengeUniqueIdProducerMock,
    }),
    input: { challengerId: alice.playerId, challengerPosition: 0 },
    expected: {
      kind: "Success",
      value: {
        challengeId: challengeUniqueIdProducerMock.getUniqueId(),
        challenger: toChallenger(alice),
        challengerPosition: 0,
      },
    },
  },
]);

describe.each(scenarios())("create challenge: workflow", (scenario) => {
  const { workflow, expected, name, input } = scenario;
  it(name, async () => {
    const runWorkflow = workflow(input);
    const actual = await runWorkflow();
    expect(actual).toEqual(expected);
  });
});
