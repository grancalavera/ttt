import {
  PlayMoveWorkflow,
  PlayMoveInput,
  PlayMoveResult,
  GameFinder,
  Game,
  PlayerFinder,
} from "model";
import { narrowScenarios, alice, bob, defaultGameId } from "test";
import { playMove } from "./play-move";

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

const alwaysFindAliceVsBobGame = alwaysFindGame({
  gameId: defaultGameId,
  players: [alice, bob],
  moves: [
    [alice, 0],
    [bob, 1],
  ],
  size: 3,
  status: { kind: "OpenGame", next: alice },
});

const neverFindPlayer: PlayerFinder = {
  findPlayer: (playerId) => async () => ({
    kind: "Failure",
    error: { kind: "PlayerNotFoundError", playerId },
  }),
};

const alwaysFindAlice: PlayerFinder = {
  findPlayer: () => async () => ({ kind: "Success", value: alice }),
};

const alwaysFindBob: PlayerFinder = {
  findPlayer: () => async () => ({ kind: "Success", value: bob }),
};

const scenarios = narrowScenarios<Scenario>([
  {
    name: "game not found",
    workflow: playMove({ ...neverFindGame, ...alwaysFindAlice }),
    input: { gameId: defaultGameId, playerId: alice.playerId, playerPosition: 0 },
    expected: {
      kind: "Failure",
      error: { kind: "GameNotFoundError", gameId: defaultGameId },
    },
  },
  {
    name: "player not found",
    workflow: playMove({ ...alwaysFindAliceVsBobGame, ...neverFindPlayer }),
    input: { gameId: defaultGameId, playerId: alice.playerId, playerPosition: 0 },
    expected: {
      kind: "Failure",
      error: { kind: "PlayerNotFoundError", playerId: alice.playerId },
    },
  },
  {
    name: "game not found and player not found",
    workflow: playMove({ ...neverFindGame, ...neverFindPlayer }),
    input: { gameId: defaultGameId, playerId: alice.playerId, playerPosition: 0 },
    expected: {
      kind: "Failure",
      error: { kind: "GameNotFoundError", gameId: defaultGameId },
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
