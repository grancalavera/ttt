import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { Match, Player } from "../../domain/model";
import {
  alice,
  bob,
  createMatchDependencies,
  matchId,
  maxActiveMatches,
} from "../../test/support";
import { UpsertFailedError, WorkflowResult } from "../support";
import { createMatchWorkflow } from "./create-match";
import { CreateMatch, TooManyActiveMatchesError } from "./workflow";

interface Scenario {
  name: string;
  runWorkflow: CreateMatch;
  input: Player;
  expected: WorkflowResult<Match>;
}

const spyOnUpsert = jest.fn();

const alicesNewMatch: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "New" },
};

const upsertFailure = failure(new UpsertFailedError(alicesNewMatch, "for reasons"));

const scenarios: Scenario[] = [
  {
    name: "too many active games",
    runWorkflow: createMatchWorkflow(
      createMatchDependencies({
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: bob,
    expected: failure(new TooManyActiveMatchesError(bob, maxActiveMatches)),
  },
  {
    name: "upsert failed",
    runWorkflow: createMatchWorkflow(
      createMatchDependencies({ upsertResult: upsertFailure, spyOnUpsert: spyOnUpsert })
    ),
    input: alice,
    expected: upsertFailure,
  },
  {
    name: "create match",
    runWorkflow: createMatchWorkflow(
      createMatchDependencies({
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: alice,
    expected: success(alicesNewMatch),
  },
];

describe.each(scenarios)("create match workflow", (scenario) => {
  const { name, runWorkflow, input, expected } = scenario;
  let actual: WorkflowResult<Match>;

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
        switch (expected.error.kind) {
          case "TooManyActiveMatchesError":
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
