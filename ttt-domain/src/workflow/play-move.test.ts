import { isSuccess, Result } from "@grancalavera/ttt-etc/dist/result";
import { DomainError, includesErrorOfKind } from "../domain/error";
import { Match, MatchDescription, Game } from "../domain/model";
import { alice, matchId, WorkflowScenario, bob } from "../test/support";
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

const expectedMatch: Match = {
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

const scenarios: WorkflowScenario<PlayMoveInput>[] = [];

xdescribe.each(scenarios)("play move workflow", (scenario) => {
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
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expected.value);
      } else {
        const includesErrorKind = includesErrorOfKind(expected.error);

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
