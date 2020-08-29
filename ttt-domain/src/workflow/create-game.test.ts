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
  MatchNotFoundError,
  TooManyActiveMatchesError,
  WorkflowError,
} from "./workflow-error";

const spyOnFind = jest.fn();
const spyOnUpsert = jest.fn();

const input: CreateGameInput = { matchId, opponent: bob };

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
    next: input.opponent,
    players: [alice, input.opponent],
  },
};

const scenarios: WorkflowScenario<CreateGameInput>[] = [
  {
    name: "too many active matches",
    runWorkflow: createGame(mockDependencies({ activeMatches: 1, maxActiveMatches: 1 })),
    input,
    expected: failure([new TooManyActiveMatchesError(input.opponent, 1)]),
  },
  {
    name: "match not found",
    runWorkflow: createGame(
      mockDependencies({
        spyOnFind,
        spyOnUpsert,
      })
    ),
    input,
    expected: failure([new MatchNotFoundError(matchId)]),
  },
  {
    name: "illegal match state",
    runWorkflow: createGame(
      mockDependencies({
        matchToFind: illegalState,
        spyOnFind,
        spyOnUpsert,
      })
    ),
    input,
    expected: failure([
      new IllegalMatchStateError(matchId, "Challenge", illegalState.state.kind),
    ]),
  },
  {
    name: "illegal challenge opponent",
    runWorkflow: createGame(
      mockDependencies({
        matchToFind: initialState,
        spyOnFind,
        spyOnUpsert,
      })
    ),
    input: { matchId, opponent: alice },
    expected: failure([new IllegalGameOpponentError(matchId, alice)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createGame(
      mockDependencies({
        matchToFind: initialState,
        spyOnFind,
        matchToUpsertFail: finalState,
        spyOnUpsert: spyOnUpsert,
      })
    ),
    input,
    expected: upsertFailure(finalState),
  },
  {
    name: "create game",
    runWorkflow: createGame(
      mockDependencies({
        matchToFind: initialState,
        spyOnFind,
        spyOnUpsert,
      })
    ),
    input,
    expected: success(finalState),
  },
];

describe.each(scenarios)("create game workflow", (scenario) => {
  const { name, runWorkflow, input, expected } = scenario;
  let actual: Result<Match, WorkflowError[]>;

  beforeEach(async () => {
    spyOnFind.mockClear();
    spyOnUpsert.mockClear();
    actual = await runWorkflow(input);
  });

  describe(name, () => {
    it("workflow", () => expect(actual).toEqual(expected));

    it("side effects", () => {
      if (isSuccess(expected)) {
        expect(spyOnFind).toHaveBeenNthCalledWith(1, input.matchId);
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expected.value);
      } else {
        const hasKind = hasErrorKind(expected.error);

        if (hasKind("TooManyActiveMatchesError")) {
          expect(spyOnFind).not.toHaveBeenCalled();
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
          expect(spyOnFind).toHaveBeenNthCalledWith(1, input.matchId);
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (hasKind("UpsertFailedError")) {
          expect(spyOnFind).toHaveBeenNthCalledWith(1, input.matchId);
          expect(spyOnUpsert).toHaveBeenNthCalledWith(1, finalState);
        }
      }
    });
  });
});
