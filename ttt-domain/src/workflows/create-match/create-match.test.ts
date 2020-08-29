import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc";
import { Match, Player } from "../../domain/model";
import {
  alice,
  bob,
  matchId,
  maxActiveMatches,
  mockDependencies,
  upsertError,
  upsertFailure,
} from "../../test/support";
import { hasErrorKind, RunWorkflow } from "../support";
import { TooManyActiveMatchesError, WorkflowError } from "../workflow-error";
import { createMatch, Input } from "./create-match";

interface Scenario {
  name: string;
  runWorkflow: RunWorkflow<Input>;
  input: Player;
  expected: Result<Match, WorkflowError[]>;
}

const spyOnUpsert = jest.fn();

const scenarios: Scenario[] = [
  {
    name: "too many active matches",
    runWorkflow: createMatch(
      mockDependencies({
        activeMatches: 1,
      })
    ),
    input: bob,
    expected: failure([new TooManyActiveMatchesError(bob, maxActiveMatches)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createMatch(
      mockDependencies({ upsertResult: upsertFailure, spyOnUpsert: spyOnUpsert })
    ),
    input: alice,
    expected: failure([upsertError]),
  },
  {
    name: "create match",
    runWorkflow: createMatch(
      mockDependencies({
        spyOnUpsert,
      })
    ),
    input: alice,
    expected: success({
      id: matchId,
      owner: alice,
      state: { kind: "New" },
    }),
  },
];

describe.each(scenarios)("create match workflow", (scenario) => {
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

        if (hasKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenCalledTimes(1);
        }
      }
    });
  });
});
