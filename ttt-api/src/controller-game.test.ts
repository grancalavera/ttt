import { CorePlayer, CorePosition } from "@grancalavera/ttt-core";
import { create, StandaloneMoveModel as MoveModel } from "./store";
import uuid from "uuid/v4";
import { ResponseGame } from "./model";
import { findAllGames, findGameById } from "./controller-game";

const Alice: CorePlayer = "O";
const Bob: CorePlayer = "X";

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
    let games: ResponseGame[];

    beforeAll(async () => {
      games = await findAllGames();
    });

    it("Then I should get an empty list of games", () => {
      expect(games).toEqual([]);
    });
  });

  const gameId = "any-game";
  describe(`When I try to find ${gameId} by ID`, () => {
    let maybeGame: ResponseGame | null;

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
  ${Alice} | ${0}     | ${"game-1"} | ${1}
  ${Bob}   | ${1}     | ${"game-1"} | ${1}
  ${Alice} | ${0}     | ${"game-2"} | ${2}
  ${Alice} | ${0}     | ${"game-3"} | ${3}
`("Finding all games:", expectation => {
  const { player, position, gameId, expected }: FindAllExpectation = expectation;
  describe(`Given ${player} plays ${position} on ${gameId}`, () => {
    beforeAll(
      async () => await MoveModel.create({ id: uuid(), gameId, player, position })
    );

    describe("When I try to find all games", () => {
      let games: ResponseGame[];

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
  ${Alice} | ${0}     | ${`${Alice}-wins`} | ${{ isGameOver: false, currentPlayer: Bob }}
  ${Bob}   | ${1}     | ${`${Alice}-wins`} | ${{ isGameOver: false, currentPlayer: Alice }}
  ${Alice} | ${3}     | ${`${Alice}-wins`} | ${{ isGameOver: false, currentPlayer: Bob }}
  ${Bob}   | ${2}     | ${`${Alice}-wins`} | ${{ isGameOver: false, currentPlayer: Alice }}
  ${Alice} | ${6}     | ${`${Alice}-wins`} | ${{ isGameOver: true, winner: Alice }}
  ${Alice} | ${1}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Bob }}
  ${Bob}   | ${0}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Alice }}
  ${Alice} | ${3}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Bob }}
  ${Bob}   | ${2}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Alice }}
  ${Alice} | ${5}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Bob }}
  ${Bob}   | ${4}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Alice }}
  ${Alice} | ${6}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Bob }}
  ${Bob}   | ${7}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Alice }}
  ${Alice} | ${8}     | ${"game-tie"}      | ${{ isGameOver: true }}
`("Finding a game by id:", expectation => {
  const { player, position, gameId, expected }: FindByIdExpectation = expectation;
  const { currentPlayer, isGameOver, winner } = expected;

  describe(`Given ${player} plays ${position} on ${gameId}`, () => {
    beforeAll(
      async () => await MoveModel.create({ id: uuid(), gameId, player, position })
    );

    describe(`When I try to find ${gameId}`, () => {
      let maybeGame: ResponseGame | null;
      let game: ResponseGame;

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
