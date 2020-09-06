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
} from "../test-support";
import { createMove } from "./create-move";
import { CreateMoveInput } from "./support";

const spyOnUpsert = jest.fn();
const mock = mockWorkflowDependencies({ spyOnUpsert });

const matchDescription: MatchDescription = {
  id: matchId,
  owner: alice,
};

const opponentFirstMoveInitialState: Game = {
  kind: "Game",
  players: [alice, bob],
  moves: [[alice, 0]],
  next: bob,
};

const opponentFirstMoveMatch: Match = {
  ...matchDescription,
  state: {
    kind: "Game",
    players: [alice, bob],
    moves: [
      [alice, 0],
      [bob, 1],
    ],
    next: alice,
  },
};

const ownerPlaysDrawInitialState: Game = {
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

const ownerDrawMove: Move = [alice, 8];

const ownerPlaysDrawExpectedMatch: Match = {
  ...matchDescription,
  state: {
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

const ownerPlaysVictoryInitialState: Game = {
  kind: "Game",
  players: [alice, bob],
  moves: [
    [alice, 0],
    [bob, 1],
    [alice, 3],
    [bob, 4],
  ],
  next: alice,
};

const ownerVictoryMove: Move = [alice, 6];

const ownerPlaysVictoryExpectedMatch: Match = {
  ...matchDescription,
  state: {
    kind: "Victory",
    players: [alice, bob],
    moves: [
      [alice, 0],
      [bob, 1],
      [alice, 3],
      [bob, 4],
      [alice, 6],
    ],
    winner: [alice, [0, 3, 6]],
  },
};

const scenarios: WorkflowScenario<CreateMoveInput>[] = [
  {
    name: "unknown player",
    runWorkflow: createMove(mock()),
    input: {
      matchDescription,
      game: opponentFirstMoveInitialState,
      move: [unknownPlayer, 2],
    },
    expectedResult: failure([new UnknownPlayerError(matchDescription, unknownPlayer)]),
  },
  {
    name: "wrong turn",
    runWorkflow: createMove(mock()),
    input: { matchDescription, game: opponentFirstMoveInitialState, move: [alice, 2] },
    expectedResult: failure([new WrongTurnError(matchDescription, alice)]),
  },
  {
    name: "illegal move (already played)",
    runWorkflow: createMove(mock()),
    input: { matchDescription, game: opponentFirstMoveInitialState, move: [bob, 0] },
    expectedResult: failure([new IllegalMoveError(matchDescription, 0)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createMove(mock({ upsertFails: true })),
    input: { matchDescription, game: opponentFirstMoveInitialState, move: [bob, 1] },
    expectedResult: upsertFailure(opponentFirstMoveMatch),
    expectedMatch: opponentFirstMoveMatch,
  },
  {
    name: "move played: Game -> Game",
    runWorkflow: createMove(mock()),
    input: { matchDescription, game: opponentFirstMoveInitialState, move: [bob, 1] },
    expectedResult: success(opponentFirstMoveMatch),
    expectedMatch: opponentFirstMoveMatch,
  },
  {
    name: "move played: Game -> Draw",
    runWorkflow: createMove(mock()),
    input: { matchDescription, game: ownerPlaysDrawInitialState, move: ownerDrawMove },
    expectedResult: success(ownerPlaysDrawExpectedMatch),
    expectedMatch: ownerPlaysDrawExpectedMatch,
  },
  {
    name: "move played: Game -> Victory",
    runWorkflow: createMove(mock()),
    input: {
      matchDescription,
      game: ownerPlaysVictoryInitialState,
      move: ownerVictoryMove,
    },
    expectedResult: success(ownerPlaysVictoryExpectedMatch),
    expectedMatch: ownerPlaysVictoryExpectedMatch,
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

        if (
          includesErrorKind("IllegalMoveError", "UnknownPlayerError", "WrongTurnError")
        ) {
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (includesErrorKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expectedMatch);
        }
      }
    });
  });
});
