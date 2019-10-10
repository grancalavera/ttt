import { CoreMove } from "@grancalavera/ttt-core";
import request from "supertest";
import uuid from "uuid/v4";
import { app } from "./app";
import {
  alice,
  bob,
  bulkCreateMoves,
  moves_aliceTiesNext,
  moves_aliceWinsNext,
  moves_gameOverAliceTies,
  moves_gameOverAliceWins,
  move_alicePlaysOnOne,
  move_alicePlaysOnZero,
  move_aliceTies,
  move_aliceWins,
  move_bobPlaysOnZero
} from "./etc/fixtures";
import { invalidPlayer, invalidPosition, GameOverError } from "./etc/exceptions";
import { PositionPlayedError, WrongTurnError, extractException } from "./etc/exceptions";
import { create } from "./store";

beforeAll(async () => create("./app.test.sqlite").sync({ force: true }));

interface Scenario {
  // given
  gameId: string;
  existingMoves: CoreMove[];
  // when
  rawMove: [string, number];
  // then
  moveStatus: number;
  gameStatus: number;
  moveBody: object;
  gameBody: object;
}

const givenMessage = (gameId: string, existingMoves: [string, number][]) => {
  if (existingMoves.length) {
    return `Given ${gameId} has the following moves: ${existingMoves.flatMap(
      ([pl, ps]) => `(${pl},${ps})`
    )}`;
  } else {
    return `Given ${gameId} doesn't have any moves`;
  }
};

const mkScenario = (
  title: string,
  prefix: string,
  mkScenarioBody: (gameId: string) => Scenario
): [string, Scenario] => {
  const gameId = `${prefix}-${uuid()}`;
  return [title, mkScenarioBody(gameId)];
};

const scenarios: [string, Scenario][] = [
  mkScenario("Playing the first move on a game", "new-game", gameId => ({
    gameId,
    existingMoves: [],
    rawMove: move_alicePlaysOnZero,
    moveStatus: 200,
    gameStatus: 200,
    moveBody: {},
    gameBody: {
      id: gameId,
      isGameOver: false,
      moves: [move_alicePlaysOnZero],
      currentPlayer: bob
    }
  })),
  mkScenario("Winning a game", "win-game", gameId => ({
    gameId,
    existingMoves: moves_aliceWinsNext,
    rawMove: move_aliceWins,
    moveStatus: 200,
    gameStatus: 200,
    moveBody: {},
    gameBody: {
      id: gameId,
      isGameOver: true,
      moves: moves_gameOverAliceWins,
      winner: alice
    }
  })),
  mkScenario("Ending a game in a tie", "tie-game", gameId => ({
    gameId,
    existingMoves: moves_aliceTiesNext,
    rawMove: move_aliceTies,
    moveStatus: 200,
    gameStatus: 200,
    moveBody: {},
    gameBody: { id: gameId, isGameOver: true, moves: moves_gameOverAliceTies }
  })),
  mkScenario("Playing in someone else's turn", "wrong-turn-game", gameId => ({
    gameId,
    existingMoves: [move_alicePlaysOnZero],
    rawMove: move_alicePlaysOnOne,
    moveStatus: 400,
    gameStatus: 200,
    moveBody: { errors: [extractException(new WrongTurnError(alice))] },
    gameBody: {
      id: gameId,
      isGameOver: false,
      moves: [move_alicePlaysOnZero],
      currentPlayer: bob
    }
  })),
  mkScenario(
    "Playing an already played position",
    "play-on-already-played-position",
    gameId => ({
      gameId,
      existingMoves: [move_alicePlaysOnZero],
      rawMove: move_bobPlaysOnZero,
      moveStatus: 400,
      gameStatus: 200,
      moveBody: {
        errors: [
          extractException(
            new PositionPlayedError(move_alicePlaysOnZero[0], move_alicePlaysOnZero[1])
          )
        ]
      },
      gameBody: {
        id: gameId,
        isGameOver: false,
        moves: [move_alicePlaysOnZero],
        currentPlayer: bob
      }
    })
  ),
  mkScenario("Playing on a game that's already over", "game-over-game", gameId => ({
    gameId,
    existingMoves: moves_gameOverAliceWins,
    rawMove: [alice, 0],
    moveStatus: 400,
    gameStatus: 200,
    moveBody: { errors: [extractException(new GameOverError(gameId))] },
    gameBody: {
      id: gameId,
      isGameOver: true,
      moves: moves_gameOverAliceWins,
      winner: alice
    }
  })),
  mkScenario("Playing with an invalid player", "invalid-player-game", gameId => ({
    gameId,
    existingMoves: [move_alicePlaysOnZero],
    rawMove: [":P", 1],
    moveStatus: 400,
    moveBody: { errors: [invalidPlayer(":P")] },
    gameStatus: 200,
    gameBody: {
      id: gameId,
      isGameOver: false,
      moves: [move_alicePlaysOnZero],
      currentPlayer: bob
    }
  })),
  mkScenario("Playing an invalid position", "invalid-position-game", gameId => ({
    gameId,
    existingMoves: [move_alicePlaysOnZero],
    rawMove: [alice, 9],
    moveStatus: 400,
    moveBody: { errors: [invalidPosition(9)] },
    gameStatus: 200,
    gameBody: {
      id: gameId,
      isGameOver: false,
      moves: [move_alicePlaysOnZero],
      currentPlayer: bob
    }
  })),
  mkScenario(
    "Playing an invalid position with an invalid player",
    "invalid-position-game",
    gameId => ({
      gameId,
      existingMoves: [move_alicePlaysOnZero],
      rawMove: [":)", 9],
      moveStatus: 400,
      moveBody: { errors: [invalidPlayer(":)"), invalidPosition(9)] },
      gameStatus: 200,
      gameBody: {
        id: gameId,
        isGameOver: false,
        moves: [move_alicePlaysOnZero],
        currentPlayer: bob
      }
    })
  )
];

describe.each(scenarios)("%s", (_, scenario) => {
  const {
    gameId,
    rawMove,
    moveStatus,
    gameStatus,
    gameBody,
    moveBody,
    existingMoves = []
  }: Scenario = scenario;

  const [player, position] = rawMove;
  let moveResp: request.Response;
  let gameResp: request.Response;

  describe(givenMessage(gameId, existingMoves), () => {
    describe(`When the move (${rawMove}) is played on game ${gameId}`, () => {
      beforeAll(async () => {
        if (existingMoves.length) {
          await bulkCreateMoves(existingMoves, gameId);
        }

        moveResp = await request(app)
          .post("/moves")
          .send({ gameId, player, position });

        gameResp = await request(app)
          .get(`/${gameId}`)
          .send();
      });

      it(`The status code for the move result should be ${moveStatus}`, () => {
        expect(moveResp.status).toEqual(moveStatus);
      });

      it(`The move response should be ${JSON.stringify(moveBody)}`, () => {
        expect(moveResp.body).toEqual(moveBody);
      });

      it(`The status code for the game ${gameId} should be ${gameStatus}`, () => {
        expect(gameResp.status).toEqual(gameStatus);
      });

      it(`The game response should be ${JSON.stringify(gameBody)}`, () => {
        expect(gameResp.body).toEqual(gameBody);
      });
    });
  });
});
