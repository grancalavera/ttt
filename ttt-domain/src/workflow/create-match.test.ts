import { isSuccess, Result, success } from "@grancalavera/ttt-etc";
import { DomainError, includesErrorOfKind } from "../domain/error";
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
const mock = mockWorkflowDependencies({ spyOnUpsert });

const newMatch: Match = {
  matchDescription: {
    id: matchId,
    owner: alice,
  },
  matchState: { kind: "New" },
};

const scenarios: WorkflowScenario<CreateMatchInput>[] = [
  {
    name: "upsert failed",
    runWorkflow: createMatch(mock({ matchToUpsertFail: newMatch })),
    input: { owner: alice },
    expectedResult: upsertFailure(newMatch),
    expectedMatch: newMatch,
  },
  {
    name: "create match",
    runWorkflow: createMatch(mock()),
    input: { owner: alice },
    expectedResult: success(newMatch),
    expectedMatch: newMatch,
  },
];

describe.each(scenarios)("create match workflow", (scenario) => {
  const { name, runWorkflow, input, expectedResult, expectedMatch } = scenario;
  let actual: Result<Match, DomainError[]>;

  beforeEach(async () => {
    spyOnUpsert.mockClear();
    actual = await runWorkflow(input);
  });

  describe(name, () => {
    it("workflow", () => expect(actual).toEqual(expectedResult));

    it("side effects", () => {
      if (isSuccess(expectedResult)) {
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expectedMatch);
      } else {
        const includesErrorKind = includesErrorOfKind(expectedResult.error);

        if (includesErrorKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expectedMatch);
        }
      }
    });
  });
});
