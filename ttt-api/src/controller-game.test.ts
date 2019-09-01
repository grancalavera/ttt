import { CorePlayer, CorePosition } from "@grancalavera/ttt-core";
import { create } from "./store";

const Alice: CorePlayer = "O";
const Bob: CorePlayer = "X";

beforeAll(async () => {
  await create("./controller-game.test.sqlite").sync({ force: true, logging: false });
});

describe("Given there are no games", () => {
  describe("When I try to find all the games", () => {
    it.todo("Then I should get an empty list of games");
  });

  const anyGame = "any-game";
  describe(`When I try to find ${anyGame} by ID`, () => {
    it.todo('Then the result should be "null"');
  });
});

interface FindAllExpectation {
  player: CorePlayer;
  position: CorePosition;
  gameId: string;
  expected: number;
}

describe.each`
  player   | position | gameId      | expected
  ${Alice} | ${0}     | ${"game-1"} | ${1}
  ${Bob}   | ${1}     | ${"game-1"} | ${1}
  ${Alice} | ${0}     | ${"game-2"} | ${2}
  ${Alice} | ${0}     | ${"game-3"} | ${3}
`("Finding all games:", (expectation: FindAllExpectation) => {
  const { player, position, gameId, expected } = expectation;
  describe(`Given ${player} plays ${position} on ${gameId}`, () => {
    describe("When I try to find all games", () => {
      it.todo(`Then ${expected} game${expected > 1 ? "s" : ""} should exist`);
    });
  });
});

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

describe.each`
  player   | position | gameId             | expected
  ${Alice} | ${0}     | ${`${Alice}-wins`} | ${{ isGameOver: false, currentPlayer: Bob }}
  ${Bob}   | ${1}     | ${`${Alice}-wins`} | ${{ isGameOver: false, currentPlayer: Alice }}
  ${Alice} | ${3}     | ${`${Alice}-wins`} | ${{ isGameOver: false, currentPlayer: Bob }}
  ${Bob}   | ${2}     | ${`${Alice}-wins`} | ${{ isGameOver: false, currentPlayer: Alice }}
  ${Alice} | ${6}     | ${`${Alice}-wins`} | ${{ isGameOver: true, winner: Alice }}
  ${Alice} | ${0}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Bob }}
  ${Bob}   | ${2}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Alice }}
  ${Alice} | ${1}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Bob }}
  ${Bob}   | ${5}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Alice }}
  ${Alice} | ${3}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Bob }}
  ${Bob}   | ${7}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Alice }}
  ${Alice} | ${4}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Bob }}
  ${Bob}   | ${8}     | ${"game-tie"}      | ${{ isGameOver: false, currentPlayer: Alice }}
  ${Alice} | ${6}     | ${"game-tie"}      | ${{ isGameOver: true }}
`("Finding a game by id:", expectation => {
  const { player, position, gameId, expected }: FindByIdExpectation = expectation;
  const { currentPlayer, isGameOver, winner } = expected;

  describe(`Given ${player} plays ${position} on ${gameId}`, () => {
    describe(`When I try to find ${gameId}`, () => {
      it.todo(`Then ${gameId} should exist`);
      it.todo(`And "currentPlayer" should equal ${currentPlayer}`);
      it.todo(`And "isGameOver" should equal ${isGameOver}`);
      it.todo(`And "winner" should equal ${winner}`);
    });
  });
});
