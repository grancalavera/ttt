import { CorePlayer, CorePosition } from "@grancalavera/ttt-core";
import uuid from "uuid/v4";
import { alice, bob } from "../etc/fixtures";
import { GameResponse } from "../model";
import { create, MoveModel } from "../store";
import { findAllGames, findGameById } from "./game";

interface FindAllExpectation {
  player: CorePlayer;
  position: CorePosition;
  gameId: string;
  expected: number;
}

interface FindByIdExpectation {
  player: CorePlayer;
  position: CorePosition;
  gameId: string;
  expected: {
    isGameOver: boolean;
    currentPlayer?: CorePlayer;
    winner?: CorePlayer;
  };
}

beforeAll(async () => {
  await create("./controller-game.test.sqlite").sync({ force: true });
});

describe("Given there are no games", () => {
  describe("When I try to find all the games", () => {
    let games: GameResponse[];

    beforeAll(async () => {
      games = await findAllGames();
    });

    it("Then I should get an empty list of games", () => {
      expect(games).toEqual([]);
    });
  });

  const gameId = "any-game";
  describe(`When I try to find ${gameId} by ID`, () => {
    let maybeGame: GameResponse | null;

    beforeAll(async () => {
      maybeGame = await findGameById(gameId);
    });

    it('Then the result should be "null"', () => {
      expect(maybeGame).toBeNull();
    });
  });
});

describe.each`
  player   | position | gameId      | expected
  ${alice} | ${0}     | ${"game-1"} | ${1}
  ${bob}   | ${1}     | ${"game-1"} | ${1}
  ${alice} | ${0}     | ${"game-2"} | ${2}
  ${alice} | ${0}     | ${"game-3"} | ${3}
`("Finding all games:", expectation => {
  const { player, position, gameId, expected }: FindAllExpectation = expectation;
  describe(`Given ${player} plays ${position} on ${gameId}`, () => {
    beforeAll(
      async () => await MoveModel.create({ id: uuid(), gameId, player, position })
    );

    describe("When I try to find all games", () => {
      let games: GameResponse[];

      beforeAll(async () => {
        games = await findAllGames();
      });

      it(`Then ${expected} game${expected > 1 ? "s" : ""} should exist`, () => {
        expect(games.length).toEqual(expected);
      });
    });
  });
});

describe.each`
  player   | position | gameId             | expected
  ${alice} | ${0}     | ${`${alice}-wins`} | ${{ isGameOver: false, currentPlayer: bob }}
  ${bob}   | ${1}     | ${`${alice}-wins`} | ${{ isGameOver: false, currentPlayer: alice }}
  ${alice} | ${3}     | ${`${alice}-wins`} | ${{ isGameOver: false, currentPlayer: bob }}
  ${bob}   | ${2}     | ${`${alice}-wins`} | ${{ isGameOver: false, currentPlayer: alice }}
  ${alice} | ${6}     | ${`${alice}-wins`} | ${{ isGameOver: true, winner: alice }}
  ${alice} | ${1}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: bob }}
  ${bob}   | ${0}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: alice }}
  ${alice} | ${3}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: bob }}
  ${bob}   | ${2}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: alice }}
  ${alice} | ${5}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: bob }}
  ${bob}   | ${4}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: alice }}
  ${alice} | ${6}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: bob }}
  ${bob}   | ${7}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: alice }}
  ${alice} | ${8}     | ${"game-tie"}      | ${{ isGameOver: true }}
`("Finding a game by id:", expectation => {
  const { player, position, gameId, expected }: FindByIdExpectation = expectation;
  const { currentPlayer, isGameOver, winner } = expected;

  describe(`Given ${player} plays ${position} on ${gameId}`, () => {
    beforeAll(
      async () => await MoveModel.create({ id: uuid(), gameId, player, position })
    );

    describe(`When I try to find ${gameId}`, () => {
      let maybeGame: GameResponse | null;
      let game: GameResponse;

      beforeAll(async () => {
        maybeGame = await findGameById(gameId);
      });

      it(`Then ${gameId} should exist`, () => {
        expect(maybeGame).not.toBeNull();
        game = maybeGame!;
      });

      it(`Then "game.currentPlayer" should equal ${currentPlayer}`, () => {
        expect(game.currentPlayer).toEqual(currentPlayer);
      });

      it(`Then "game.isGameOver" should equal ${isGameOver}`, () => {
        expect(game.isGameOver).toEqual(isGameOver);
      });

      it(`Then "game.winner" should equal ${winner}`, () => {
        expect(game.winner).toEqual(winner);
      });
    });
  });
});
