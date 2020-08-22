import { Game, GameId } from "../../domain/model";
import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc";
import {
  alice,
  bob,
  defaultGameId,
  illegalPlayer,
  narrowScenarios,
} from "../../test/support";
import {
  CreateMoveInput,
  GameFinder,
  GameUpdateFailedError,
  GameUpdater,
  PlayMoveInput,
  PlayMoveResult,
  PlayMoveWorkflow,
  GameNotFoundError,
} from "./workflow";
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

const spyOnUpdateGame = jest.fn();

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

const neverUpdateGame: GameUpdater = {
  updateGame: (gameId, game) => async () => {
    spyOnUpdateGame(gameId, game);
    return failure(new GameUpdateFailedError(game));
  },
};

const alwaysUpdateGame: GameUpdater = {
  updateGame: (gameId, game) => async () => {
    spyOnUpdateGame(gameId, game);
    return success(undefined);
  },
};

const allValidationErrorsInput: CreateMoveInput = {
  game: impossibleGame,
  player: illegalPlayer,
  playerPosition: -1,
};

const scenarios = narrowScenarios<Scenario>([
  {
    name: "force all validation errors",
    workflow: playMove({ ...alwaysFindGame(impossibleGame), ...alwaysUpdateGame }),
    input: {
      gameId: defaultGameId,
      player: illegalPlayer,
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
    workflow: playMove({ ...neverFindGame, ...alwaysUpdateGame }),
    input: { gameId: defaultGameId, player: illegalPlayer, playerPosition: 0 },
    expected: failure(new GameNotFoundError(defaultGameId)),
  },
  {
    name: "alice plays the third move",
    workflow: playMove({
      ...alwaysFindGame(defaultGame),
      ...alwaysUpdateGame,
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
      ...alwaysUpdateGame,
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
      ...alwaysUpdateGame,
    }),
    input: { gameId: defaultGameId, player: alice, playerPosition: aliceWinningMove[1] },
    expected: {
      kind: "Success",
      value: aliceWinsGame,
    },
  },
  {
    name: "alice plays the winning move but the game fails to update",
    workflow: playMove({
      ...alwaysFindGame(winOnNextMoveGame),
      ...neverUpdateGame,
    }),
    input: { gameId: defaultGameId, player: alice, playerPosition: aliceWinningMove[1] },
    expected: failure(new GameUpdateFailedError(aliceWinsGame)),
  },
]);

describe.each(scenarios())("play move: workflow", (scenario) => {
  const { name, workflow, input, expected } = scenario;
  const runWorkflow = workflow(input);

  let actual: PlayMoveResult;

  beforeEach(async () => {
    spyOnUpdateGame.mockClear();
    actual = await runWorkflow();
  });

  describe(name, () => {
    it("workflow", () => {
      expect(actual).toEqual(expected);
    });

    it("side effects: update game", () => {
      const sideEffects = inferSideEffects(expected);
      if (isSuccess(sideEffects)) {
        const [gameId, game] = sideEffects.value;
        expect(spyOnUpdateGame).toHaveBeenNthCalledWith(1, gameId, game);
      } else {
        expect(spyOnUpdateGame).not.toHaveBeenCalled();
      }
    });
  });
});

const inferSideEffects = (expected: PlayMoveResult): Result<[GameId, Game], void> => {
  if (isSuccess(expected)) {
    const game = expected.value;
    return success([game.gameId, game]);
  }

  switch (expected.error.kind) {
    case "CreateMoveValidationError": {
      return failure(undefined);
    }
    case "GameNotFoundError": {
      return failure(undefined);
    }
    case "GameUpdateFailedError": {
      const { game } = expected.error;
      return success([game.gameId, game]);
    }
    default: {
      const never: never = expected.error;
      throw new Error(`unexpected error kind ${never}`);
    }
  }
};
