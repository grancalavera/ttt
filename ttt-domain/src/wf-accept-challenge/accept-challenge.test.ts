import {
  AcceptChallengeInput,
  AcceptChallengeResult,
  AcceptChallengeWorkflow,
  ChallengeFinder,
  OpponentFinder,
} from "model";
import { alicesChallenge } from "./fixtures";
import { bob } from "test";
import { toOpponent } from "test/players";

interface Scenario {
  name: string;
  workflow: AcceptChallengeWorkflow;
  input: AcceptChallengeInput;
  expected: AcceptChallengeResult;
}

const neverFindChallenge: ChallengeFinder = {
  findChallenge: (challengeId) => async () => ({
    kind: "Failure",
    error: { kind: "ChallengeNotFoundError", challengeId },
  }),
};

const alwaysFindAlicesChallenge: ChallengeFinder = {
  findChallenge: (challengeId) => async () => ({
    kind: "Success",
    value: alicesChallenge,
  }),
};

const neverFindOpponent: OpponentFinder = {
  findOpponent: (opponentId) => async () => ({
    kind: "Failure",
    error: { kind: "OpponentNotFoundError", opponentId },
  }),
};

const alwaysFindBobAsOpponent: OpponentFinder = {
  findOpponent: () => async () => ({ kind: "Success", value: toOpponent(bob) }),
};

describe("nothing", () => {
  it("should pass", () => {
    expect(true).toBe(false);
  });
});
