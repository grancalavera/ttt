import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc";
import {
  DomainError,
  includesErrorOfKind,
  TooManyActiveMatchesError,
} from "../domain/error";
import { Match } from "../domain/model";
import {
  alice,
  matchId,
  mockWorkflowDependencies,
  upsertFailure,
  WorkflowScenario,
} from "../test/support";
import { createMatch } from "./create-match";
import { CreateMatchInput } from "./support";

const spyOnUpsert = jest.fn();

const expectedMatch: Match = {
  matchDescription: {
    id: matchId,
    owner: alice,
  },
  matchState: { kind: "New" },
};

const scenarios: WorkflowScenario<CreateMatchInput>[] = [
  {
    name: "too many active matches",
    runWorkflow: createMatch(
      mockWorkflowDependencies({
        activeMatches: 1,
        maxActiveMatches: 1,
      })
    ),
    input: { owner: alice },
    expected: failure([new TooManyActiveMatchesError(alice, 1)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createMatch(
      mockWorkflowDependencies({ matchToUpsertFail: expectedMatch, spyOnUpsert })
    ),
    input: { owner: alice },
    expected: upsertFailure(expectedMatch),
  },
  {
    name: "create match",
    runWorkflow: createMatch(
      mockWorkflowDependencies({
        spyOnUpsert,
      })
    ),
    input: { owner: alice },
    expected: success(expectedMatch),
  },
];

describe.each(scenarios)("create match workflow", (scenario) => {
  const { name, runWorkflow, input, expected } = scenario;
  let actual: Result<Match, DomainError[]>;

  beforeEach(async () => {
    spyOnUpsert.mockClear();
    actual = await runWorkflow(input);
  });

  describe(name, () => {
    it("workflow", () => expect(actual).toEqual(expected));

    it("side effects", () => {
      if (isSuccess(expected)) {
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expectedMatch);
      } else {
        const includesErrorKind = includesErrorOfKind(expected.error);

        if (includesErrorKind("TooManyActiveMatchesError")) {
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (includesErrorKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expectedMatch);
        }
      }
    });
  });
});
