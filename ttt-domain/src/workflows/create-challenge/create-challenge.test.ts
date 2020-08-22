import { Challenge } from "../../domain/model";
import { failure, Result, success } from "@grancalavera/ttt-etc";
import {
  alice,
  challengeUniqueIdProducer,
  defaultChallengeId,
  narrowScenarios,
  toChallenger,
} from "../../test/support";
import {
  ChallengeCreationFailedError,
  ChallengeCreator,
  CreateChallengeInput,
  CreateChallengeResult,
  CreateChallengeWorkflow,
} from "./workflow";
import { createChallenge } from "./create-challenge";

const spyOnCreateChallenge = jest.fn();

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

const neverCreateChallenge: ChallengeCreator = {
  createChallenge: (data) => async () => {
    spyOnCreateChallenge(data);
    return failure(new ChallengeCreationFailedError(data));
  },
};

const alwaysCreateChallenge: ChallengeCreator = {
  createChallenge: (data) => async () => {
    spyOnCreateChallenge(data);
    return success(undefined);
  },
};

const scenarios = narrowScenarios<Scenario>([
  {
    name: "create challenge but fail to save it",
    workflow: createChallenge({
      ...challengeUniqueIdProducer,
      ...neverCreateChallenge,
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
      ...challengeUniqueIdProducer,
      ...alwaysCreateChallenge,
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
  const runWorkflow = workflow(input);

  let actual: Result<Challenge, ChallengeCreationFailedError>;

  beforeEach(async () => {
    spyOnCreateChallenge.mockClear();
    actual = await runWorkflow();
  });

  describe(name, () => {
    it("workflow", () => {
      expect(actual).toEqual(expected);
    });

    it("side effects: create challenge", () => {
      expect(spyOnCreateChallenge).toHaveBeenCalledWith(alicesChallenge);
    });
  });
});
