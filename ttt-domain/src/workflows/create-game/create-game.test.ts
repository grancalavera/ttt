import { Game } from "../../domain/model";
import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc";
import {
  alice,
  bob,
  defaultChallengeId,
  getMatchUniqueId,
  narrowScenarios,
  toOpponent,
} from "../../test/support";
import {
  AcceptChallengeInput,
  AcceptChallengeResult,
  AcceptChallengeWorkflow,
  FindChallenge,
  GameCreationFailedError,
  CreateGame,
} from "./workflow";
import { acceptChallenge, failWithGameValidationError } from "./create-game";
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

const neverFindChallenge: FindChallenge = {
  findChallenge: (challengeId) => async () => ({
    kind: "Failure",
    error: { kind: "ChallengeNotFoundError", challengeId },
  }),
};

const alwaysFindAlicesChallenge: FindChallenge = {
  findChallenge: (challengeId) => async () => ({
    kind: "Success",
    value: alicesChallenge,
  }),
};

const neverCreateGame: CreateGame = {
  createGame: (game) => async () => {
    spyOnCreateGame(game);
    return failure(new GameCreationFailedError(game));
  },
};

const alwaysCreateGame: CreateGame = {
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
      ...getMatchUniqueId,
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
      ...getMatchUniqueId,
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
      ...getMatchUniqueId,
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
      ...getMatchUniqueId,
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
      ...getMatchUniqueId,
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
      ...alwaysCreateGame,
      ...getMatchUniqueId,
    }),
    input: {
      challengeId: defaultChallengeId,
      opponent: toOpponent(bob),
      opponentPosition: 1,
    },
    expected: success(aliceChallengesBobGame),
  },
  {
    name:
      "Bob accepts Alice's challenge and plays another move, but game fails to be created",
    workflow: acceptChallenge({
      ...alwaysFindAlicesChallenge,
      ...neverCreateGame,
      ...getMatchUniqueId,
    }),
    input: {
      challengeId: defaultChallengeId,
      opponent: toOpponent(bob),
      opponentPosition: 1,
    },
    expected: {
      kind: "Failure",
      error: { kind: "GameCreationFailedError", game: aliceChallengesBobGame },
    },
  },
]);

describe.each(scenarios())("accept challenge: workflow", (scenario) => {
  const { name, workflow, input, expected } = scenario;
  const runWorkflow = workflow(input);

  let actual: AcceptChallengeResult;

  beforeEach(async () => {
    spyOnCreateGame.mockClear();
    actual = await runWorkflow();
  });

  describe(name, () => {
    it("workflow", () => {
      expect(actual).toEqual(expected);
    });

    it("side effects: create game", () => {
      const sideEffects = inferSideEffects(expected);
      if (isSuccess(sideEffects)) {
        expect(spyOnCreateGame).toHaveBeenNthCalledWith(1, sideEffects.value);
      } else {
        expect(spyOnCreateGame).not.toHaveBeenCalled();
      }
    });
  });
});

const inferSideEffects = (expected: AcceptChallengeResult): Result<Game, void> => {
  if (isSuccess(expected)) {
    return success(expected.value);
  }

  switch (expected.error.kind) {
    case "ChallengeNotFoundError": {
      return failure(undefined);
    }
    case "CreateGameValidationError": {
      return failure(undefined);
    }
    case "GameCreationFailedError": {
      const { game } = expected.error;
      return success(game);
    }
    default: {
      const never: never = expected.error;
      throw new Error(`unexpected error kind ${never}`);
    }
  }
};
