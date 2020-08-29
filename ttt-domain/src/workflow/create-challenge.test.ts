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
  MatchNotFoundError,
  TooManyActiveMatchesError,
  WorkflowError,
} from "./workflow-error";

const spyOnFind = jest.fn();
const spyOnUpsert = jest.fn();

const input: CreateChallengeInput = { matchId, move: [alice, 0] };

const initialState: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "New" },
};

const finalState: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "Challenge", move: input.move },
};

const scenarios: WorkflowScenario<CreateChallengeInput>[] = [
  {
    name: "too many active matches",
    runWorkflow: createChallenge(
      mockDependencies({ activeMatches: 1, maxActiveMatches: 1 })
    ),
    input,
    expected: failure([new TooManyActiveMatchesError(input.move[0], 1)]),
  },
  {
    name: "match not found",
    runWorkflow: createChallenge(
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
    runWorkflow: createChallenge(
      mockDependencies({
        matchToFind: finalState,
        spyOnFind,
        spyOnUpsert,
      })
    ),
    input,
    expected: failure([
      new IllegalMatchStateError(matchId, "New", finalState.state.kind),
    ]),
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
        spyOnFind,
        spyOnUpsert,
      })
    ),
    input,
    expected: failure([new IllegalMatchChallengerError(matchId, alice)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createChallenge(
      mockDependencies({
        matchToFind: initialState,
        spyOnFind,
        matchToUpsertFail: finalState,
        spyOnUpsert,
      })
    ),
    input,
    expected: upsertFailure(finalState),
  },
  {
    name: "create challenge",
    runWorkflow: createChallenge(
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

describe.each(scenarios)("create challenge workflow", (scenario) => {
  const { name, runWorkflow: runWorkflow, input, expected } = scenario;
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
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, finalState);
      } else {
        const hasKind = hasErrorKind(expected.error);

        if (hasKind("TooManyActiveMatchesError")) {
          expect(spyOnFind).not.toHaveBeenCalled();
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
