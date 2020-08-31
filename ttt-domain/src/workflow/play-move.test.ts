import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc/dist/result";
import {
  DomainError,
  IllegalMoveError,
  includesErrorOfKind,
  UnknownPlayerError,
  WrongTurnError,
} from "../domain/error";
import { Game, Match, MatchDescription, Move } from "../domain/model";
import {
  alice,
  bob,
  matchId,
  mockWorkflowDependencies,
  unknownPlayer,
  upsertFailure,
  WorkflowScenario,
} from "../test/support";
import { playMove } from "./play-move";
import { PlayMoveInput } from "./support";

const spyOnUpsert = jest.fn();
const mock = mockWorkflowDependencies({ spyOnUpsert });

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

const alicePlaysDrawInitialState: Game = {
  kind: "Game",
  players: [alice, bob],
  moves: [
    [alice, 0],
    [bob, 3],
    [alice, 6],
    [bob, 4],
    [alice, 1],
    [bob, 2],
    [alice, 5],
    [bob, 7],
  ],
  next: alice,
};

const aliceDrawMove: Move = [alice, 8];

const alicePlaysDrawExpectedMatch: Match = {
  matchDescription,
  matchState: {
    kind: "Draw",
    players: [alice, bob],
    moves: [
      [alice, 0],
      [bob, 3],
      [alice, 6],
      [bob, 4],
      [alice, 1],
      [bob, 2],
      [alice, 5],
      [bob, 7],
      [alice, 8],
    ],
  },
};

const scenarios: WorkflowScenario<PlayMoveInput>[] = [
  {
    name: "unknown player",
    runWorkflow: playMove(mock()),
    input: { matchDescription, game: initialState, move: [unknownPlayer, 2] },
    expectedResult: failure([new UnknownPlayerError(matchDescription, unknownPlayer)]),
  },
  {
    name: "wrong turn",
    runWorkflow: playMove(mock()),
    input: { matchDescription, game: initialState, move: [alice, 2] },
    expectedResult: failure([new WrongTurnError(matchDescription, alice)]),
  },
  {
    name: "illegal move (already played)",
    runWorkflow: playMove(mock()),
    input: { matchDescription, game: initialState, move: [bob, 0] },
    expectedResult: failure([new IllegalMoveError(matchDescription, 0)]),
  },
  {
    name: "upsert failed",
    runWorkflow: playMove(mock({ matchToUpsertFail: bobFirstPlayMatch })),
    input: { matchDescription, game: initialState, move: [bob, 1] },
    expectedResult: upsertFailure(bobFirstPlayMatch),
    expectedMatch: bobFirstPlayMatch,
  },
  {
    name: "move played: Game -> Game",
    runWorkflow: playMove(mock()),
    input: { matchDescription, game: initialState, move: [bob, 1] },
    expectedResult: success(bobFirstPlayMatch),
    expectedMatch: bobFirstPlayMatch,
  },
  {
    name: "move played: Game -> Draw",
    runWorkflow: playMove(mock()),
    input: { matchDescription, game: alicePlaysDrawInitialState, move: aliceDrawMove },
    expectedResult: success(alicePlaysDrawExpectedMatch),
    expectedMatch: alicePlaysDrawExpectedMatch,
  },
  { name: "move played: Game -> Victory" } as WorkflowScenario<PlayMoveInput>,
].slice(0, 6) as WorkflowScenario<PlayMoveInput>[];

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
