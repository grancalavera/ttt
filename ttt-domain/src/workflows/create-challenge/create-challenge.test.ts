import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { Match } from "../../domain/model";
import { alice, bob, matchId, standardDependencies } from "../../test/support";
import {
  IllegalMatchStateError,
  MatchNotFoundError,
  MoveInput,
  UpsertFailedError,
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

const alicesNewMatch: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "New" },
};

const bobsNewMatch: Match = {
  id: matchId,
  owner: bob,
  state: { kind: "New" },
};

const alicesChallenge: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "Challenge", move: alicesInput.move },
};

const upsertFailure = failure(new UpsertFailedError(alicesNewMatch, "for reasons"));

const scenarios: Scenario[] = [
  {
    name: "match not found",
    ruWorkflow: createChallengeWorkflow(
      standardDependencies({
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
    name: "illegal match owner",
    ruWorkflow: createChallengeWorkflow(
      standardDependencies({
        findResult: success(bobsNewMatch),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: alicesInput,
    expected: failure(new IllegalMatchOwnerError(alicesInput)),
  },
  {
    name: "illegal match state",
    ruWorkflow: createChallengeWorkflow(
      standardDependencies({
        findResult: success(alicesChallenge),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: alicesInput,
    expected: failure(new IllegalMatchStateError(alicesInput, "New", "Challenge")),
  },
  {
    name: "upsert failed",
    ruWorkflow: createChallengeWorkflow(
      standardDependencies({
        findResult: success(alicesNewMatch),
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
      standardDependencies({
        findResult: success(alicesNewMatch),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: alicesInput,
    expected: success(alicesChallenge),
  },
];

describe.each(scenarios)("create challenge: workflow", (scenario) => {
  const { name, ruWorkflow, input, expected } = scenario;
  let actual: WorkflowResult<Match>;

  beforeEach(async () => {
    spyOnFind.mockClear();
    spyOnUpsert.mockClear();
    actual = await ruWorkflow(input);
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
