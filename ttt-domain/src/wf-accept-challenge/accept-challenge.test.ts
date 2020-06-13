import {
  AcceptChallengeInput,
  AcceptChallengeResult,
  AcceptChallengeWorkflow,
  ChallengeFinder,
  GameCreator,
  Game,
  AcceptChallengeError,
  GameCreationFailedError,
} from "model";
import { success, Result, failure } from "result";
import { bob, defaultChallengeId, gameUniqueIdProducerMock, narrowScenarios } from "test";
import { alice, toOpponent } from "test/players";
import { acceptChallenge, failWithGameValidationError } from "./accept-challenge";
import { invalidPlayers } from "./create-players";
import { invalidPositions } from "./create-positions";
import { aliceChallengesBobGame, alicesChallenge } from "./fixtures";

const spyOnCreateGame = jest.fn();

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

const neverCreateGame: GameCreator = {
  createGame: (game) => async () => {
    spyOnCreateGame(game);
    return failure(new GameCreationFailedError(game));
  },
};

const alwaysCreateGame: GameCreator = {
  createGame: (game) => async () => {
    spyOnCreateGame(game);
    return success(undefined);
  },
};

const scenarios = narrowScenarios<Scenario>([
  {
    name: "Challenge not found and challenger found",
    workflow: acceptChallenge({
      ...neverFindChallenge,
      ...neverCreateGame,
      ...gameUniqueIdProducerMock,
    }),
    input: {
      challengeId: defaultChallengeId,
      opponent: toOpponent(bob),
      opponentPosition: 1,
    },
    expected: {
      kind: "Failure",
      error: { kind: "ChallengeNotFoundError", challengeId: defaultChallengeId },
    },
  },
  {
    name: "Challenge not found and challenger not found",
    workflow: acceptChallenge({
      ...neverFindChallenge,
      ...neverCreateGame,
      ...gameUniqueIdProducerMock,
    }),
    input: {
      challengeId: defaultChallengeId,
      opponent: toOpponent(bob),
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
      ...neverCreateGame,
      ...gameUniqueIdProducerMock,
    }),
    input: {
      challengeId: defaultChallengeId,
      opponent: toOpponent(alice),
      opponentPosition: 1,
    },
    expected: failWithGameValidationError([
      invalidPlayers({
        challenge: alicesChallenge,
        opponent: toOpponent(alice),
        opponentPosition: 1,
      }),
    ]),
  },
  {
    name: "Bob accepts Alice's challenge and plays the same move",
    workflow: acceptChallenge({
      ...alwaysFindAlicesChallenge,
      ...neverCreateGame,
      ...gameUniqueIdProducerMock,
    }),
    input: {
      challengeId: defaultChallengeId,
      opponent: toOpponent(bob),
      opponentPosition: 0,
    },
    expected: failWithGameValidationError([
      invalidPositions({
        challenge: alicesChallenge,
        opponent: toOpponent(bob),
        opponentPosition: 0,
      }),
    ]),
  },
  {
    name: "Alice accepts her own challenge and plays the same move",
    workflow: acceptChallenge({
      ...alwaysFindAlicesChallenge,
      ...neverCreateGame,
      ...gameUniqueIdProducerMock,
    }),
    input: {
      challengeId: defaultChallengeId,
      opponent: toOpponent(alice),
      opponentPosition: 0,
    },
    expected: failWithGameValidationError([
      invalidPlayers({
        challenge: alicesChallenge,
        opponent: toOpponent(alice),
        opponentPosition: 0,
      }),
      invalidPositions({
        challenge: alicesChallenge,
        opponent: toOpponent(alice),
        opponentPosition: 0,
      }),
    ]),
  },
  {
    name: "Bob accepts Alice's challenge and plays another move",
    workflow: acceptChallenge({
      ...alwaysFindAlicesChallenge,
      ...neverCreateGame,
      ...gameUniqueIdProducerMock,
    }),
    input: {
      challengeId: defaultChallengeId,
      opponent: toOpponent(bob),
      opponentPosition: 1,
    },
    expected: success(aliceChallengesBobGame),
  },
]);

describe.each(scenarios())("accept challenge: workflow", (scenario) => {
  const { name, workflow, input, expected } = scenario;
  const runWorkflow = workflow(input);

  let actual: Result<Game, AcceptChallengeError>;

  beforeEach(async () => {
    spyOnCreateGame.mockClear();
    actual = await runWorkflow();
  });

  describe(name, () => {
    it("workflow", () => {
      expect(actual).toEqual(expected);
    });
  });
});
