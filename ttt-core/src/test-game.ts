import assert from "assert";
import {
  findWin,
  resolveGame,
  nextPlayer,
  Move,
  isPos,
  isPlayer,
  GAME_PLAYING,
  GAME_OVER_TIE,
  GAME_OVER_WIN
} from "./game";
import { gameFromString } from "./test-common";

const lastIsX: Move[] = [["x", 0]];
const lastIsO: Move[] = [["o", 0]];

const gameForX = gameFromString(`
x o.
x  .
xo .
`);

const gameForO = gameFromString(`
o x.
o  .
ox .
`);

const gameIsOpen = gameFromString("");

const gameIsTie = gameFromString(`
xox.
oxo.
oxo.
`);

export const test = () => {
  assert([0, 1, 2, 3, 4, 5, 6, 7, 8].every(isPos), "all known positions are positions");
  assert(["o", "x"].every(isPlayer), "all known players are players");

  assert.equal(nextPlayer(lastIsX), "o", "next player should be o");
  assert.equal(nextPlayer(lastIsO), "x", "next player should be x");

  assert.deepEqual(findWin("x", gameIsOpen), undefined, "an open game has no winner");
  assert.deepEqual(findWin("x", gameIsTie), undefined, "a tie game has no winner");
  assert.deepEqual(findWin("x", gameForX), [0, 3, 6], "x should win the game");
  assert.deepEqual(findWin("o", gameForO), [0, 3, 6], "o should win the game");

  assert.deepEqual(
    resolveGame(gameIsOpen).kind,
    GAME_PLAYING,
    "the game should be still open"
  );
  assert.deepEqual(
    resolveGame(gameIsTie).kind,
    GAME_OVER_TIE,
    "the game should be a tie"
  );

  const winMove = [0, 3, 6];

  const xWins = resolveGame(gameForX);
  if (xWins.kind === GAME_OVER_WIN) {
    assert.equal(xWins.winner, "x", "x should win the game");
    assert.deepEqual(xWins.winningMove, winMove, `${winMove} should be the winning move`);
  } else {
    assert(false, "should be a GameOverWin");
  }

  const oWins = resolveGame(gameForO);
  if (oWins.kind === GAME_OVER_WIN) {
    assert.equal(oWins.winner, "o", "o should win the game");
    assert.deepEqual(oWins.winningMove, winMove, `${winMove} should be the winning move`);
  } else {
    assert(false, "should be a GameOverWin");
  }
};
