import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { Match, Player, SystemConfig } from "../../domain/model";
import { alice, bob } from "../../test/support";
import {
  arePlayersTheSame,
  CountActiveMatches,
  GetUniqueId,
  UnknownError,
  UpsertMatch,
  WorkflowResult,
} from "../support";
import { createMatchWorkflow } from "./create-match";
import { CreateMatch, TooManyActiveMatchesError } from "./workflow";

interface Scenario {
  name: string;
  runWorkflow: CreateMatch;
  input: Player;
  expected: WorkflowResult<Match>;
}

const spyOnUpsertMatch = jest.fn();
const matchId = "default-match-id";
const maxActiveMatches = 1;
const unknownFailure = failure(new UnknownError("Boom!"));

const dependencies: SystemConfig & GetUniqueId & CountActiveMatches & UpsertMatch = {
  gameSize: 3 * 3,
  maxActiveMatches,
  getUniqueId: () => matchId,
  countActiveMatches: async (p) => (arePlayersTheSame(p, bob) ? 1 : 0),
  upsertMatch: async (match) => {
    spyOnUpsertMatch(match);
    return success(undefined);
  },
};

const scenarios: Scenario[] = [
  {
    name: "Create match successfully",
    runWorkflow: createMatchWorkflow(dependencies),
    input: alice,
    expected: success({
      id: matchId,
      owner: alice,
      state: { kind: "New" },
    }),
  },
  {
    name: "Fail with too many active games",
    runWorkflow: createMatchWorkflow(dependencies),
    input: bob,
    expected: failure(new TooManyActiveMatchesError(bob, maxActiveMatches)),
  },
  {
    name: "Fail with unknown error",
    runWorkflow: createMatchWorkflow({
      ...dependencies,
      upsertMatch: async (match) => {
        spyOnUpsertMatch(match);
        return unknownFailure;
      },
    }),
    input: bob,
    expected: unknownFailure,
  },
];

describe.each(scenarios)("create match workflow", (scenario) => {
  const { name, runWorkflow, input, expected } = scenario;
  let actual: WorkflowResult<Match>;

  beforeEach(async () => {
    spyOnUpsertMatch.mockClear();
    actual = await runWorkflow(input);
  });

  describe(name, () => {
    it("workflow", () => {
      expect(actual).toEqual(expected);
    });

    it("side effects", () => {
      if (isSuccess(expected)) {
        expect(spyOnUpsertMatch).toHaveBeenNthCalledWith(1, expected.value);
      } else {
        switch (expected.error.kind) {
          case "TooManyActiveMatchesError":
            expect(spyOnUpsertMatch).not.toHaveBeenCalled();
            break;
          case "UnknownError":
            expect(spyOnUpsertMatch).toHaveBeenCalledTimes(1);
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
