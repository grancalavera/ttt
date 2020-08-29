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
import { createChallenge } from "./create-challenge";
import { CreateChallengeInput, hasErrorKind } from "./support";
import {
  IllegalMatchChallengerError,
  IllegalMatchStateError,
  TooManyActiveMatchesError,
  WorkflowError,
} from "./workflow-error";

const spyOnUpsert = jest.fn();

const initialState: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "New" },
};

const illegalState: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "Challenge", move: [alice, 0] },
};

const illegalOwner: Match = {
  id: matchId,
  owner: bob,
  state: { kind: "Challenge", move: [bob, 0] },
};

const finalState: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "Challenge", move: [alice, 0] },
};

const scenarios: WorkflowScenario<CreateChallengeInput>[] = [
  {
    name: "too many active matches",
    runWorkflow: createChallenge(
      mockDependencies({ activeMatches: 1, maxActiveMatches: 1 })
    ),
    input: { match: initialState, move: [alice, 0] },
    expected: failure([new TooManyActiveMatchesError(alice, 1)]),
  },
  {
    name: "illegal match state",
    runWorkflow: createChallenge(mockDependencies({ spyOnUpsert })),
    input: { match: illegalState, move: [alice, 0] },
    expected: failure([new IllegalMatchStateError(finalState, "New")]),
  },
  {
    name: "illegal match owner",
    runWorkflow: createChallenge(
      mockDependencies({
        matchToFind: {
          id: matchId,
          owner: bob,
          state: { kind: "New" },
        },
        spyOnUpsert,
      })
    ),
    input: { match: illegalOwner, move: [alice, 0] },
    expected: failure([new IllegalMatchChallengerError(illegalOwner, alice)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createChallenge(
      mockDependencies({
        matchToUpsertFail: finalState,
        spyOnUpsert,
      })
    ),
    input: { match: initialState, move: [alice, 0] },
    expected: upsertFailure(finalState),
  },
  {
    name: "create challenge",
    runWorkflow: createChallenge(mockDependencies({ spyOnUpsert })),
    input: { match: initialState, move: [alice, 0] },
    expected: success(finalState),
  },
];

describe.each(scenarios)("create challenge workflow", (scenario) => {
  const { name, runWorkflow: runWorkflow, input, expected } = scenario;
  let actual: Result<Match, WorkflowError[]>;

  beforeEach(async () => {
    spyOnUpsert.mockClear();
    actual = await runWorkflow(input);
  });

  describe(name, () => {
    it("workflow", () => expect(actual).toEqual(expected));

    it("side effects", () => {
      if (isSuccess(expected)) {
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, finalState);
      } else {
        const hasKind = hasErrorKind(expected.error);

        if (hasKind("TooManyActiveMatchesError")) {
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (
          hasKind(
            "MatchNotFoundError",
            "IllegalMatchChallengerError",
            "IllegalMatchStateError"
          )
        ) {
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (hasKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenCalledTimes(1);
        }
      }
    });
  });
});
