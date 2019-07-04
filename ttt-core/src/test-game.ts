import assert from "assert";
import {
  findWin,
  resolveGame,
  winnerGame,
  openGame,
  tieGame,
  nextPlayer,
  Game
} from "./game";
import { gameFromString } from "./test-common";

const lastIsX: Game = [["x", 0]];
const lastIsO: Game = [["o", 0]];

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
  assert.equal(nextPlayer(lastIsX), "o", "next player should be o");
  assert.equal(nextPlayer(lastIsO), "x", "next player should be x");

  assert.deepEqual(findWin("x", gameIsOpen), undefined, "an open game has no winner");
  assert.deepEqual(findWin("x", gameIsTie), undefined, "a tie game has no winner");
  assert.deepEqual(findWin("x", gameForX), [0, 3, 6], "x should win the game");
  assert.deepEqual(findWin("o", gameForO), [0, 3, 6], "o should win the game");

  assert.deepEqual(resolveGame(gameIsOpen), openGame, "the game should be still open");
  assert.deepEqual(resolveGame(gameIsTie), tieGame, "the game should be a tie");
  assert.deepEqual(
    resolveGame(gameForX),
    winnerGame("x", [0, 3, 6]),
    "x should win the game"
  );
  assert.deepEqual(
    resolveGame(gameForO),
    winnerGame("o", [0, 3, 6]),
    "o should win the game"
  );
};
