import { isSuccess, Result, failure, success } from "@grancalavera/ttt-etc/dist/result";
import {
  DomainError,
  includesErrorOfKind,
  UnknownPlayerError,
  WrongTurnError,
  IllegalMoveError,
} from "../domain/error";
import { Game, Match, MatchDescription } from "../domain/model";
import {
  alice,
  bob,
  matchId,
  mockWorkflowDependencies,
  upsertFailure,
  WorkflowScenario,
  unknownPlayer,
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
    name: "unknown player",
    runWorkflow: playMove(mockWorkflowDependencies()),
    input: { matchDescription, game: initialState, move: [unknownPlayer, 2] },
    expectedResult: failure([new UnknownPlayerError(matchDescription, unknownPlayer)]),
  },
  {
    name: "wrong turn",
    runWorkflow: playMove(mockWorkflowDependencies()),
    input: { matchDescription, game: initialState, move: [alice, 2] },
    expectedResult: failure([new WrongTurnError(matchDescription, alice)]),
  },
  {
    name: "illegal move (already played)",
    runWorkflow: playMove(mockWorkflowDependencies()),
    input: { matchDescription, game: initialState, move: [bob, 0] },
    expectedResult: failure([new IllegalMoveError(matchDescription, 0)]),
  },
  {
    name: "upsert failed",
    runWorkflow: playMove(
      mockWorkflowDependencies({ matchToUpsertFail: bobFirstPlayMatch, spyOnUpsert })
    ),
    input: { matchDescription, game: initialState, move: [bob, 1] },
    expectedResult: upsertFailure(bobFirstPlayMatch),
    expectedMatch: bobFirstPlayMatch,
  },
  {
    name: "move played: Game -> Game",
    runWorkflow: playMove(mockWorkflowDependencies({ spyOnUpsert })),
    input: { matchDescription, game: initialState, move: [bob, 1] },
    expectedResult: success(bobFirstPlayMatch),
    expectedMatch: bobFirstPlayMatch,
  },
  { name: "move played: Game -> Draw" } as WorkflowScenario<PlayMoveInput>,
  { name: "move played: Game -> Victory" } as WorkflowScenario<PlayMoveInput>,
].slice(0, 5) as WorkflowScenario<PlayMoveInput>[];

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

        if (includesErrorKind("IllegalMoveError")) {
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (includesErrorKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expectedMatch);
        }
      }
    });
  });
});
