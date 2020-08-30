import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc";
import {
  DomainError,
  IllegalGameOpponentError,
  includesErrorOfKind,
  TooManyActiveMatchesError,
} from "../domain/error";
import { Challenge, Match, MatchDescription } from "../domain/model";
import {
  alice,
  bob,
  matchId,
  mockWorkflowDependencies,
  upsertFailure,
  WorkflowScenario,
} from "../test/support";
import { createGame } from "./create-game";
import { CreateGameInput } from "./support";

const spyOnUpsert = jest.fn();

const matchDescription: MatchDescription = {
  id: matchId,
  owner: alice,
};

const initialState: Challenge = {
  kind: "Challenge",
  move: [alice, 0],
};

const expectedMatch: Match = {
  matchDescription,
  matchState: {
    kind: "Game",
    players: [alice, bob],
    moves: [[alice, 0]],
    next: bob,
  },
};

const scenarios: WorkflowScenario<CreateGameInput>[] = [
  {
    name: "too many active matches",
    runWorkflow: createGame(
      mockWorkflowDependencies({ activeMatches: 1, maxActiveMatches: 1 })
    ),
    input: { matchDescription, challenge: initialState, opponent: bob },
    expected: failure([new TooManyActiveMatchesError(bob, 1)]),
  },
  {
    name: "illegal challenge opponent",
    runWorkflow: createGame(
      mockWorkflowDependencies({
        spyOnUpsert,
      })
    ),
    input: {
      matchDescription,
      challenge: initialState,
      opponent: alice,
    },
    expected: failure([new IllegalGameOpponentError(matchId, alice)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createGame(
      mockWorkflowDependencies({
        matchToUpsertFail: expectedMatch,
        spyOnUpsert: spyOnUpsert,
      })
    ),
    input: { matchDescription, challenge: initialState, opponent: bob },
    expected: upsertFailure(expectedMatch),
  },
  {
    name: "create game",
    runWorkflow: createGame(mockWorkflowDependencies({ spyOnUpsert })),
    input: { matchDescription, challenge: initialState, opponent: bob },
    expected: success(expectedMatch),
  },
];

describe.each(scenarios)("create game workflow", (scenario) => {
  const { name, runWorkflow, input, expected } = scenario;
  let actual: Result<Match, DomainError[]>;

  beforeEach(async () => {
    spyOnUpsert.mockClear();
    actual = await runWorkflow(input);
  });

  describe(name, () => {
    it("workflow", () => expect(actual).toEqual(expected));

    it("side effects", () => {
      if (isSuccess(expected)) {
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expected.value);
      } else {
        const includesErrorKind = includesErrorOfKind(expected.error);

        if (includesErrorKind("TooManyActiveMatchesError", "IllegalGameOpponentError")) {
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (includesErrorKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expectedMatch);
        }
      }
    });
  });
});
