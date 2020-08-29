import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc";
import { Match } from "../domain/model";
import {
  alice,
  matchId,
  mockDependencies,
  upsertFailure,
  WorkflowScenario,
} from "../test/support";
import { createMatch } from "./create-match";
import { CreateMatchInput, hasErrorKind } from "./support";
import { TooManyActiveMatchesError, WorkflowError } from "./workflow-error";

const spyOnUpsert = jest.fn();

const input = alice;

const finalState: Match = {
  id: matchId,
  owner: input,
  state: { kind: "New" },
};

const scenarios: WorkflowScenario<CreateMatchInput>[] = [
  {
    name: "too many active matches",
    runWorkflow: createMatch(
      mockDependencies({
        activeMatches: 1,
        maxActiveMatches: 1,
      })
    ),
    input,
    expected: failure([new TooManyActiveMatchesError(input, 1)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createMatch(
      mockDependencies({ matchToUpsertFail: finalState, spyOnUpsert })
    ),
    input,
    expected: upsertFailure(finalState),
  },
  {
    name: "create match",
    runWorkflow: createMatch(
      mockDependencies({
        spyOnUpsert,
      })
    ),
    input,
    expected: success(finalState),
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
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, finalState);
      } else {
        const hasKind = hasErrorKind(expected.error);

        if (hasKind("TooManyActiveMatchesError")) {
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (hasKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenNthCalledWith(1, finalState);
        }
      }
    });
  });
});
