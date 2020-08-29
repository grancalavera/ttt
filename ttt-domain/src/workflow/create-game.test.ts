import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc";
import { Match } from "../domain/model";
import {
  alice,
  bob,
  matchId,
  mockDependencies,
  upsertFailure,
  WorkflowScenario,
} from "../test/support";
import { createGame } from "./create-game";
import { CreateGameInput, hasErrorKind } from "./support";
import {
  IllegalGameOpponentError,
  IllegalMatchStateError,
  TooManyActiveMatchesError,
  WorkflowError,
} from "./workflow-error";

const spyOnUpsert = jest.fn();

const initialState: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "Challenge", move: [alice, 0] },
};

const illegalState: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "New" },
};

const finalState: Match = {
  id: matchId,
  owner: alice,
  state: {
    kind: "Game",
    moves: [[alice, 0]],
    next: bob,
    players: [alice, bob],
  },
};

const scenarios: WorkflowScenario<CreateGameInput>[] = [
  {
    name: "too many active matches",
    runWorkflow: createGame(mockDependencies({ activeMatches: 1, maxActiveMatches: 1 })),
    input: { match: initialState, opponent: bob },
    expected: failure([new TooManyActiveMatchesError(bob, 1)]),
  },
  {
    name: "illegal match state",
    runWorkflow: createGame(mockDependencies({ spyOnUpsert })),
    input: { match: illegalState, opponent: bob },
    expected: failure([new IllegalMatchStateError(illegalState, "Challenge")]),
  },
  {
    name: "illegal challenge opponent",
    runWorkflow: createGame(
      mockDependencies({
        spyOnUpsert,
      })
    ),
    input: { match: initialState, opponent: alice },
    expected: failure([new IllegalGameOpponentError(matchId, alice)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createGame(
      mockDependencies({
        matchToUpsertFail: finalState,
        spyOnUpsert: spyOnUpsert,
      })
    ),
    input: { match: initialState, opponent: bob },
    expected: upsertFailure(finalState),
  },
  {
    name: "create game",
    runWorkflow: createGame(mockDependencies({ spyOnUpsert })),
    input: { match: initialState, opponent: bob },
    expected: success(finalState),
  },
];

describe.each(scenarios)("create game workflow", (scenario) => {
  const { name, runWorkflow, input, expected } = scenario;
  let actual: Result<Match, WorkflowError[]>;

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
        const hasKind = hasErrorKind(expected.error);

        if (hasKind("TooManyActiveMatchesError")) {
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (
          hasKind(
            "MatchNotFoundError",
            "IllegalMatchStateError",
            "IllegalGameOpponentError",
            "IllegalMoveError"
          )
        ) {
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (hasKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenNthCalledWith(1, finalState);
        }
      }
    });
  });
});
