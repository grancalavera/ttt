import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc";
import { Match } from "../../domain/model";
import {
  alice,
  bob,
  matchId,
  mockDependencies,
  WorkflowScenario,
  upsertError,
  upsertFailure,
} from "../../test/support";
import { hasErrorKind } from "../support";
import {
  IllegalMatchOwnerError,
  IllegalMatchStateError,
  MatchNotFoundError,
  WorkflowError,
} from "../workflow-error";
import { createChallenge, Input } from "./create-challenge";

const spyOnFind = jest.fn();
const spyOnUpsert = jest.fn();

const alicesInput: Input = { matchId, move: [alice, 0] };

const matchOnNewState: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "New" },
};

const matchOnChallengeState: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "Challenge", move: alicesInput.move },
};

const scenarios: WorkflowScenario<Input>[] = [
  {
    name: "match not found",
    runWorkflow: createChallenge(
      mockDependencies({
        findResult: failure(new MatchNotFoundError(matchId)),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: alicesInput,
    expected: failure([new MatchNotFoundError(matchId)]),
  },
  {
    name: "illegal match state",
    runWorkflow: createChallenge(
      mockDependencies({
        findResult: success(matchOnChallengeState),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: alicesInput,
    expected: failure([
      new IllegalMatchStateError(matchId, "New", matchOnChallengeState.state.kind),
    ]),
  },
  {
    name: "illegal match owner",
    runWorkflow: createChallenge(
      mockDependencies({
        findResult: success({
          id: matchId,
          owner: bob,
          state: { kind: "New" },
        }),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: alicesInput,
    expected: failure([new IllegalMatchOwnerError(matchId, alice)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createChallenge(
      mockDependencies({
        findResult: success(matchOnNewState),
        spyOnFind,
        upsertResult: upsertFailure,
        spyOnUpsert,
      })
    ),
    input: alicesInput,
    expected: failure([upsertError]),
  },
  {
    name: "create challenge",
    runWorkflow: createChallenge(
      mockDependencies({
        findResult: success(matchOnNewState),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: alicesInput,
    expected: success(matchOnChallengeState),
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
      expect(spyOnFind).toHaveBeenNthCalledWith(1, input.matchId);

      if (isSuccess(expected)) {
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expected.value);
      } else {
        const hasKind = hasErrorKind(expected.error);

        if (
          hasKind(
            "MatchNotFoundError",
            "IllegalMatchOwnerError",
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
