import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc";
import {
  DomainError,
  IllegalChallengerError,
  includesErrorOfKind,
  TooManyActiveMatchesError,
} from "../domain/error";
import { Match, MatchDescription } from "../domain/model";
import {
  alice,
  bob,
  matchId,
  mockWorkflowDependencies,
  upsertFailure,
  WorkflowScenario,
} from "../test/support";
import { createChallenge } from "./create-challenge";
import { CreateChallengeInput } from "./support";

const spyOnUpsert = jest.fn();

const matchDescription: MatchDescription = {
  id: matchId,
  owner: alice,
};

const expectedMatch: Match = {
  matchDescription,
  matchState: { kind: "Challenge", move: [alice, 0] },
};

const scenarios: WorkflowScenario<CreateChallengeInput>[] = [
  {
    name: "too many active matches",
    runWorkflow: createChallenge(
      mockWorkflowDependencies({ activeMatches: 1, maxActiveMatches: 1 })
    ),
    input: { matchDescription, move: [alice, 0] },
    expected: failure([new TooManyActiveMatchesError(alice, 1)]),
  },
  {
    name: "illegal challenger",
    runWorkflow: createChallenge(mockWorkflowDependencies({ spyOnUpsert })),
    input: { matchDescription, move: [bob, 0] },
    expected: failure([new IllegalChallengerError(matchDescription, bob)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createChallenge(
      mockWorkflowDependencies({
        matchToUpsertFail: expectedMatch,
        spyOnUpsert,
      })
    ),
    input: { matchDescription, move: [alice, 0] },
    expected: upsertFailure(expectedMatch),
  },
  {
    name: "create challenge",
    runWorkflow: createChallenge(mockWorkflowDependencies({ spyOnUpsert })),
    input: { matchDescription, move: [alice, 0] },
    expected: success(expectedMatch),
  },
];

describe.each(scenarios)("create challenge workflow", (scenario) => {
  const { name, runWorkflow: runWorkflow, input, expected } = scenario;
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

        if (includesErrorKind("TooManyActiveMatchesError", "IllegalChallengerError")) {
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (includesErrorKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenCalledTimes(1);
        }
      }
    });
  });
});
