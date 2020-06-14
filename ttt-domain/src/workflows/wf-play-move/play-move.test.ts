import {
  CreateMoveInput,
  Game,
  GameFinder,
  PlayMoveInput,
  PlayMoveResult,
  PlayMoveWorkflow,
} from "../../model";
import { alice, bob, chris, defaultGameId, narrowScenarios } from "../../test-support";
import {
  alicesDrawMove,
  aliceWinningMove,
  aliceWinsGame,
  defaultGame,
  drawGame,
  drawOnNextMoveGame,
  impossibleGame,
  winOnNextMoveGame,
} from "./fixtures";
import { failWithMoveValidationError, playMove } from "./play-move";
import { invalidGameStatus } from "./validate-game-status-is-open";
import { invalidTurn } from "./validate-is-players-turn";
import { invalidPlayer } from "./validate-player-exists-in-game";
import { invalidPositionOutsideBoard } from "./validate-position-inside-board";
import { invalidPosition } from "./validate-position-not-played";

interface Scenario {
  name: string;
  workflow: PlayMoveWorkflow;
  input: PlayMoveInput;
  expected: PlayMoveResult;
}

const neverFindGame: GameFinder = {
  findGame: (gameId) => async () => ({
    kind: "Failure",
    error: { kind: "GameNotFoundError", gameId },
  }),
};

const alwaysFindGame = (game: Game): GameFinder => ({
  findGame: () => async () => ({ kind: "Success", value: game }),
});

const allValidationErrorsInput: CreateMoveInput = {
  game: impossibleGame,
  player: chris,
  playerPosition: -1,
};

const scenarios = narrowScenarios<Scenario>([
  {
    name: "force all validation errors",
    workflow: playMove({ ...alwaysFindGame(impossibleGame) }),
    input: {
      gameId: defaultGameId,
      player: chris,
      playerPosition: -1,
    },
    expected: failWithMoveValidationError([
      invalidGameStatus(allValidationErrorsInput),
      invalidPlayer(allValidationErrorsInput),
      invalidTurn(allValidationErrorsInput),
      invalidPosition(allValidationErrorsInput),
      invalidPositionOutsideBoard(allValidationErrorsInput),
    ]),
  },
  {
    name: "game not found",
    workflow: playMove({ ...neverFindGame }),
    input: { gameId: defaultGameId, player: chris, playerPosition: 0 },
    expected: {
      kind: "Failure",
      error: { kind: "GameNotFoundError", gameId: defaultGameId },
    },
  },
  {
    name: "alice plays the third move",
    workflow: playMove({
      ...alwaysFindGame(defaultGame),
    }),
    input: { gameId: defaultGameId, player: alice, playerPosition: 2 },
    expected: {
      kind: "Success",
      value: {
        ...defaultGame,
        moves: [...defaultGame.moves, [alice, 2]],
        status: { kind: "OpenGame", next: bob },
      },
    },
  },
  {
    name: "alice plays the draw move",
    workflow: playMove({
      ...alwaysFindGame(drawOnNextMoveGame),
    }),
    input: { gameId: defaultGameId, player: alice, playerPosition: alicesDrawMove[1] },
    expected: {
      kind: "Success",
      value: drawGame,
    },
  },
  {
    name: "alice plays the winning move",
    workflow: playMove({
      ...alwaysFindGame(winOnNextMoveGame),
    }),
    input: { gameId: defaultGameId, player: alice, playerPosition: aliceWinningMove[1] },
    expected: {
      kind: "Success",
      value: aliceWinsGame,
    },
  },
]);

describe.each(scenarios())("play move: workflow", (scenario) => {
  const { name, workflow, input, expected } = scenario;
  it(name, async () => {
    const runWorkflow = workflow(input);
    const actual = await runWorkflow();
    expect(actual).toEqual(expected);
  });
});
