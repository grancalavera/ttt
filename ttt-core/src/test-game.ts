import assert from "assert";
import {
  findWin,
  resolveGame,
  nextPlayer,
  CoreMove,
  isPos,
  isPlayer,
  CORE_GAME_PLAYING,
  CORE_GAME_OVER_TIE,
  CORE_GAME_OVER_WIN
} from "./game";
import { gameFromString } from "./test-common";

const lastIsX: CoreMove[] = [["X", 0]];
const lastIsO: CoreMove[] = [["O", 0]];

const gameForX = gameFromString(`
X O.
X  .
XO .
`);

const gameForO = gameFromString(`
O X.
O  .
OX .
`);

const gameIsOpen = gameFromString("");

const gameIsTie = gameFromString(`
XOX.
OXO.
OXO.
`);

export const test = () => {
  assert([0, 1, 2, 3, 4, 5, 6, 7, 8].every(isPos), "all known positions are positions");
  assert(["O", "X"].every(isPlayer), "all known players are players");

  assert.equal(nextPlayer(lastIsX), "O", "next player should be o");
  assert.equal(nextPlayer(lastIsO), "X", "next player should be x");

  assert.deepEqual(findWin("X", gameIsOpen), undefined, "an open game has no winner");
  assert.deepEqual(findWin("X", gameIsTie), undefined, "a tie game has no winner");
  assert.deepEqual(findWin("X", gameForX), [0, 3, 6], "x should win the game");
  assert.deepEqual(findWin("O", gameForO), [0, 3, 6], "o should win the game");

  assert.deepEqual(
    resolveGame(gameIsOpen).kind,
    CORE_GAME_PLAYING,
    "the game should be still open"
  );
  assert.deepEqual(
    resolveGame(gameIsTie).kind,
    CORE_GAME_OVER_TIE,
    "the game should be a tie"
  );

  const winMove = [0, 3, 6];

  const xWins = resolveGame(gameForX);
  if (xWins.kind === CORE_GAME_OVER_WIN) {
    assert.equal(xWins.winner, "X", "X should win the game");
    assert.deepEqual(xWins.winningMove, winMove, `${winMove} should be the winning move`);
  } else {
    assert(false, "should be a GameOverWin");
  }

  const oWins = resolveGame(gameForO);
  if (oWins.kind === CORE_GAME_OVER_WIN) {
    assert.equal(oWins.winner, "O", "O should win the game");
    assert.deepEqual(oWins.winningMove, winMove, `${winMove} should be the winning move`);
  } else {
    assert(false, "should be a GameOverWin");
  }
};
