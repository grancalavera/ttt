import {
  ChallengeSaver,
  CreateChallengeInput,
  CreateChallengeResult,
  CreateChallengeWorkflow,
  Challenge,
  ChallengeNotSavedError,
} from "model";
import {
  alice,
  challengeUniqueIdProducerMock,
  narrowScenarios,
  defaultChallengeId,
} from "test";
import { toChallenger } from "test/players";
import { createChallenge } from "./create-challenge";
import { failure, success, Result } from "result";

const spyOnSave = jest.fn();

export const alicesChallenge: Challenge = {
  challengeId: defaultChallengeId,
  challenger: toChallenger(alice),
  challengerPosition: 0,
};

interface Scenario {
  name: string;
  workflow: CreateChallengeWorkflow;
  input: CreateChallengeInput;
  expected: CreateChallengeResult;
}

const alwaysFailToSaveChallenge: ChallengeSaver = {
  saveChallenge: (data) => async () => {
    spyOnSave(data);
    return failure(new ChallengeNotSavedError(data));
  },
};

const alwaysSaveChallenge: ChallengeSaver = {
  saveChallenge: (data) => async () => {
    spyOnSave(data);
    return success(undefined);
  },
};

const scenarios = narrowScenarios<Scenario>([
  {
    name: "create challenge but fail to save it",
    workflow: createChallenge({
      ...challengeUniqueIdProducerMock,
      ...alwaysFailToSaveChallenge,
    }),
    input: { challenger: toChallenger(alice), challengerPosition: 0 },
    expected: {
      kind: "Failure",
      error: { kind: "ChallengeNotSavedError", challenge: alicesChallenge },
    },
  },
  {
    name: "create and save challenge",
    workflow: createChallenge({
      ...challengeUniqueIdProducerMock,
      ...alwaysSaveChallenge,
    }),
    input: { challenger: toChallenger(alice), challengerPosition: 0 },
    expected: {
      kind: "Success",
      value: alicesChallenge,
    },
  },
]);

describe.each(scenarios())("create challenge: workflow", (scenario) => {
  const { workflow, expected, name, input } = scenario;
  let actual: Result<Challenge, ChallengeNotSavedError>;

  beforeEach(async () => {
    spyOnSave.mockClear();
    const runWorkflow = workflow(input);
    actual = await runWorkflow();
  });

  describe(name, () => {
    it("workflow", () => {
      expect(actual).toEqual(expected);
    });

    it("side effects: save", () => {
      expect(spyOnSave).toHaveBeenCalledWith(alicesChallenge);
    });
  });
});
