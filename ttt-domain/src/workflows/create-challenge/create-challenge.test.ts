import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { Match } from "../../domain/model";
import { alice, bob, matchId, mockDependencies, upsertFailure } from "../../test/support";
import {
  IllegalMatchStateError,
  MatchNotFoundError,
  MoveInput,
  WorkflowResult,
} from "../support";
import { createChallengeWorkflow } from "./create-challenge";
import { CreateChallenge, IllegalMatchOwnerError } from "./workflow";

interface Scenario {
  name: string;
  ruWorkflow: CreateChallenge;
  input: MoveInput;
  expected: WorkflowResult<Match>;
}

const spyOnFind = jest.fn();
const spyOnUpsert = jest.fn();

const alicesInput: MoveInput = { matchId, move: [alice, 0] };

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

const scenarios: Scenario[] = [
  {
    name: "match not found",
    ruWorkflow: createChallengeWorkflow(
      mockDependencies({
        findResult: failure(new MatchNotFoundError(matchId)),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: alicesInput,
    expected: failure(new MatchNotFoundError(matchId)),
  },
  {
    name: "illegal match state",
    ruWorkflow: createChallengeWorkflow(
      mockDependencies({
        findResult: success(matchOnChallengeState),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: alicesInput,
    expected: failure(
      new IllegalMatchStateError(alicesInput, "New", matchOnChallengeState.state.kind)
    ),
  },
  {
    name: "illegal match owner",
    ruWorkflow: createChallengeWorkflow(
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
    expected: failure(new IllegalMatchOwnerError(alicesInput)),
  },
  {
    name: "upsert failed",
    ruWorkflow: createChallengeWorkflow(
      mockDependencies({
        findResult: success(matchOnNewState),
        spyOnFind,
        upsertResult: upsertFailure,
        spyOnUpsert,
      })
    ),
    input: alicesInput,
    expected: upsertFailure,
  },
  {
    name: "create challenge",
    ruWorkflow: createChallengeWorkflow(
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

describe.each(scenarios)("create challenge: workflow", (scenario) => {
  const { name, ruWorkflow: runWorkflow, input, expected } = scenario;
  let actual: WorkflowResult<Match>;

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
        switch (expected.error.kind) {
          case "MatchNotFoundError":
          case "IllegalMatchOwnerError":
          case "IllegalMatchStateError":
            expect(spyOnUpsert).not.toHaveBeenCalled();
            break;
          case "UpsertFailedError":
            expect(spyOnUpsert).toHaveBeenCalledTimes(1);
            break;
          default:
            throw new Error(
              `This workflow should never fail with ${expected.error.kind}`
            );
        }
      }
    });
  });
});
