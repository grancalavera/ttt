import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc";
import {
  DomainError,
  IllegalGameOpponentError,
  includesErrorOfKind,
} from "../domain/error";
import { Challenge, Match, MatchDescription } from "../domain/model";
import {
  alice,
  bob,
  matchId,
  mockWorkflowDependencies,
  upsertFailure,
  WorkflowScenario,
} from "../test-support";
import { createGame } from "./create-game";
import { CreateGameInput } from "./support";

const spyOnUpsert = jest.fn();
const mock = mockWorkflowDependencies({ spyOnUpsert });

const matchDescription: MatchDescription = {
  id: matchId,
  owner: alice,
};

const initialState: Challenge = {
  kind: "Challenge",
  move: [alice, 0],
};

const gameMatch: Match = {
  ...matchDescription,
  state: {
    kind: "Game",
    players: [alice, bob],
    moves: [[alice, 0]],
    next: bob,
  },
};

const scenarios: WorkflowScenario<CreateGameInput>[] = [
  {
    name: "illegal challenge opponent",
    runWorkflow: createGame(mock()),
    input: {
      matchDescription,
      challenge: initialState,
      opponent: alice,
    },
    expectedResult: failure([new IllegalGameOpponentError(matchId, alice)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createGame(mock({ upsertFails: true })),
    input: { matchDescription, challenge: initialState, opponent: bob },
    expectedResult: upsertFailure(gameMatch),
    expectedMatch: gameMatch,
  },
  {
    name: "create game",
    runWorkflow: createGame(mock()),
    input: { matchDescription, challenge: initialState, opponent: bob },
    expectedResult: success(gameMatch),
    expectedMatch: gameMatch,
  },
];

describe.each(scenarios)("create game workflow", (scenario) => {
  const { name, runWorkflow, input, expectedResult, expectedMatch } = scenario;
  let actual: Result<Match, DomainError[]>;

  beforeEach(async () => {
    spyOnUpsert.mockClear();
    actual = await runWorkflow(input);
  });

  describe(name, () => {
    it("workflow", () => expect(actual).toEqual(expectedResult));

    it("side effects", () => {
      if (isSuccess(expectedResult)) {
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expectedMatch);
      } else {
        const includesErrorKind = includesErrorOfKind(expectedResult.error);

        if (includesErrorKind("IllegalGameOpponentError")) {
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (includesErrorKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expectedMatch);
        }
      }
    });
  });
});
