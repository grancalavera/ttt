import {
  CreateMoveInput,
  Game,
  GameFinder,
  PlayMoveInput,
  PlayMoveResult,
  PlayMoveWorkflow,
} from "model";
import { alice, bob, chris, defaultGameId, narrowScenarios } from "test";
import { aliceChallengesBobGame } from "./fixtures";
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

const forceAllValidationErrorsGame: Game = {
  gameId: defaultGameId,
  size: 3,
  players: [alice, bob],
  moves: [
    [alice, -1],
    [bob, 1],
  ],
  status: { kind: "DrawGame" },
};

const allValidationErrorsInput: CreateMoveInput = {
  game: forceAllValidationErrorsGame,
  player: chris,
  playerPosition: -1,
};

const scenarios = narrowScenarios<Scenario>([
  {
    name: "force all validation errors",
    workflow: playMove({ ...alwaysFindGame(forceAllValidationErrorsGame) }),
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
]);

describe.each(scenarios(0, 1))("play move: workflow", (scenario) => {
  const { name, workflow, input, expected } = scenario;
  it(name, async () => {
    const runWorkflow = workflow(input);
    const actual = await runWorkflow();
    expect(actual).toEqual(expected);
  });
});
