import assert from "assert";
import { board, Board, Moves } from "./game";
import { renderGame } from "./simulation";
import { gameFromString } from "./test-common";

const emptyBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
const gameBoard = ["x", " ", "o", "x", " ", " ", "x", "o", " "];

const gameForX: Moves = gameFromString(`
x o.
x  .
xo .
`);

const empty = `
┌─────────────────┐
│                 │
│      │   │      │
│   ───┼───┼───   │
│      │   │      │
│   ───┼───┼───   │
│      │   │      │
│                 │
└─────────────────┘
`;

const gameView = `
┌─────────────────┐
│                 │
│    x │   │ o    │
│   ───┼───┼───   │
│    x │   │      │
│   ───┼───┼───   │
│    x │ o │      │
│                 │
└─────────────────┘
`;

const gameToBoardView = (board: Board, game: Moves): string[] =>
  board.map(i => {
    const maybeMove = game.find(([_, x]) => x === i);
    if (maybeMove) {
      return maybeMove[0];
    } else {
      return " ";
    }
  });

export const test = () => {
  assert.deepEqual(
    gameToBoardView(board, []),
    emptyBoard,
    "should transform an empty game to an empty board"
  );

  assert.deepEqual(
    gameToBoardView(board, gameForX),
    gameBoard,
    "should transform an game to a board"
  );

  assert.equal(renderGame(board)([]), empty, "should draw an empty board");
  assert.equal(renderGame(board)(gameForX), gameView, "should draw a board with a game");
};
