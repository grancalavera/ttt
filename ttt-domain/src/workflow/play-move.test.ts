import { isSuccess, Result } from "@grancalavera/ttt-etc/dist/result";
import { DomainError, includesErrorOfKind } from "../domain/error";
import { Game, Match, MatchDescription } from "../domain/model";
import {
  alice,
  bob,
  matchId,
  mockWorkflowDependencies,
  upsertFailure,
  WorkflowScenario,
} from "../test/support";
import { playMove } from "./play-move";
import { PlayMoveInput } from "./support";

const spyOnUpsert = jest.fn();

const matchDescription: MatchDescription = {
  id: matchId,
  owner: alice,
};

const initialState: Game = {
  kind: "Game",
  players: [alice, bob],
  moves: [[alice, 0]],
  next: bob,
};

const bobFirstPlayMatch: Match = {
  matchDescription,
  matchState: {
    kind: "Game",
    players: [alice, bob],
    moves: [
      [alice, 0],
      [bob, 1],
    ],
    next: alice,
  },
};

const scenarios: WorkflowScenario<PlayMoveInput>[] = [
  {
    name: "upsert failed",
    runWorkflow: playMove(
      mockWorkflowDependencies({
        matchToUpsertFail: bobFirstPlayMatch,
        spyOnUpsert: spyOnUpsert,
      })
    ),
    input: { matchDescription, game: initialState, move: [bob, 1] },
    expectedResult: upsertFailure(bobFirstPlayMatch),
    expectedMatch: bobFirstPlayMatch,
  },
];

describe.each(scenarios)("play move workflow", (scenario) => {
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

        if (includesErrorKind("IllegalGameOpponentError", "IllegalMoveError")) {
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (includesErrorKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expectedMatch);
        }
      }
    });
  });
});
