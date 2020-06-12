import {
  AcceptChallengeInput,
  AcceptChallengeResult,
  AcceptChallengeWorkflow,
  ChallengeFinder,
  OpponentFinder,
} from "model";
import {
  bob,
  challengeUniqueIdProducerMock,
  defaultChallengeId,
  narrowScenarios,
} from "test";
import { alice, toOpponent } from "test/players";
import { acceptChallenge } from "./accept-challenge";
import { alicesChallenge } from "./fixtures";

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

const alwaysFindAliceAsOpponent: OpponentFinder = {
  findOpponent: () => async () => ({ kind: "Success", value: toOpponent(alice) }),
};

const scenarios = narrowScenarios<Scenario>([
  {
    name: "Challenge not found and challenger found",
    workflow: acceptChallenge({
      ...neverFindChallenge,
      ...alwaysFindBobAsOpponent,
      ...challengeUniqueIdProducerMock,
    }),
    input: {
      challengeId: defaultChallengeId,
      opponentId: bob.playerId,
      opponentPosition: 1,
    },
    expected: {
      kind: "Failure",
      error: { kind: "ChallengeNotFoundError", challengeId: defaultChallengeId },
    },
  },
  {
    name: "Challenge found and challenger not found",
    workflow: acceptChallenge({
      ...alwaysFindAlicesChallenge,
      ...neverFindOpponent,
      ...challengeUniqueIdProducerMock,
    }),
    input: {
      challengeId: defaultChallengeId,
      opponentId: bob.playerId,
      opponentPosition: 1,
    },
    expected: {
      kind: "Failure",
      error: { kind: "OpponentNotFoundError", opponentId: bob.playerId },
    },
  },
  {
    name: "Challenge not found and challenger not found",
    workflow: acceptChallenge({
      ...neverFindChallenge,
      ...neverFindOpponent,
      ...challengeUniqueIdProducerMock,
    }),
    input: {
      challengeId: defaultChallengeId,
      opponentId: bob.playerId,
      opponentPosition: 1,
    },
    expected: {
      kind: "Failure",
      error: { kind: "ChallengeNotFoundError", challengeId: defaultChallengeId },
    },
  },
  {
    name: "Alice accepts her own challenge and play another move",
    workflow: acceptChallenge({
      ...alwaysFindAlicesChallenge,
      ...alwaysFindAliceAsOpponent,
      ...challengeUniqueIdProducerMock,
    }),
    input: {
      challengeId: defaultChallengeId,
      opponentId: alice.playerId,
      opponentPosition: 1,
    },
    expected: {} as any,
  },
  { name: "Alice accepts her own challenge and plays the same move" } as any,
  { name: "Bob accepts Alice's challenge and plays the same move" } as any,
  { name: "Bob accepts Alice's challenge and plays another move" } as any,
]);

describe.each(scenarios(0, 3))("accept challenge: workflow", (scenario) => {
  const { name, workflow, input, expected } = scenario;
  it(name, async () => {
    const runWorkflow = workflow(input);
    const actual = await runWorkflow();
    expect(actual).toEqual(expected);
  });
});
