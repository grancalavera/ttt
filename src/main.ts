import assert, { AssertionError } from "assert";

// prettier-ignore
type Pos = 0 | 1 | 2
         | 3 | 4 | 5
         | 6 | 7 | 8;

type Player = "x" | "o";
type Win = [Pos, Pos, Pos];

type Move = [Player, Pos];
type Game = Move[];
type GameResult = "xWon" | "oWon" | "tie" | "open";

type Board = [Pos, Pos, Pos, Pos, Pos, Pos, Pos, Pos, Pos];

const winningMoves: Win[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const board: Board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const isWinner = (winMoves: Win[], player: Player) => (game: Game): Boolean => {
  const moves = game
    .filter(([q]) => player === q)
    .map(([_, pos]) => pos)
    .sort((a, b) => a - b);

  return winMoves.reduce(
    (won, wins) => moves.filter(m => wins.includes(m)).length === 3 || won,
    false
  );
};

const isXWinner = isWinner(winningMoves, "x");
const isOWinner = isWinner(winningMoves, "o");

const getGameResult = (board: Board, game: Game): GameResult => {
  if (isOWinner(game)) {
    return "oWon";
  } else if (isXWinner(game)) {
    return "xWon";
  } else if (game.length === board.length) {
    return "tie";
  } else {
    return "open";
  }
};

const chooseRandomPos = (game: Game): Pos => {
  const played = game.map(([_, p]) => p);
  const moves = board.filter(p => !played.includes(p));
  const min = 0;
  const max = moves.length - 1;
  const move = randInt(min, max);
  return moves[move];
};

const nextPlayer = (game: Game): Player => {
  const [lastMove] = game;
  if (lastMove) {
    return lastMove[0] === "x" ? "o" : "x";
  } else {
    return ["x", "o"][randInt(0, 1)] as Player;
  }
};

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const turn = (game: Game): Game => {
  const player = nextPlayer(game);
  const pos = chooseRandomPos(game);
  const move: Move = [player, pos];
  return [move, ...game];
};

const play = (board: Board, game: Game): void => {
  const result = getGameResult(board, game);
  console.log(renderBoard(board)(game));

  if (result === "oWon" || result === "xWon" || result === "tie") {
    console.log(result);
  } else {
    setTimeout(() => {
      const newGame = turn(game);
      play(board, newGame);
    }, 500);
  }
};

type Cell = Player | " ";
type BoardView = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

const gameToBoardView = (board: Board, game: Game): BoardView =>
  board.map(i => {
    const maybeMove = game.find(([_, x]) => x === i);
    if (maybeMove) {
      return maybeMove[0];
    } else {
      return " ";
    }
  }) as BoardView;

const renderBoard = (board: Board) => (game: Game): string => {
  const b = gameToBoardView(board, game);
  return `
 ${b[0]} │ ${b[1]} │ ${b[2]}  .
───┼───┼─── .
 ${b[3]} │ ${b[4]} │ ${b[5]}  .
───┼───┼─── .
 ${b[6]} │ ${b[7]} │ ${b[8]}  .
`;
};

const game: Game = [["x", 0], ["o", 2], ["x", 3], ["o", 7], ["x", 6]];
const emptyBoard: BoardView = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
const gameBoard: BoardView = ["x", " ", "o", "x", " ", " ", "x", "o", " "];

const empty = `
   │   │    .
───┼───┼─── .
   │   │    .
───┼───┼─── .
   │   │    .
`;

const gameView = `
 x │   │ o  .
───┼───┼─── .
 x │   │    .
───┼───┼─── .
 x │ o │    .
`;

try {
  assert.ok(isXWinner(game), "x should win the game");
  assert.ok(!isOWinner(game), "o should loose the game");

  assert.deepEqual(
    gameToBoardView(board, []),
    emptyBoard,
    "should transform an empty game to an empty board"
  );

  assert.deepEqual(
    gameToBoardView(board, game),
    gameBoard,
    "should transform an game to a board"
  );

  assert.equal(renderBoard(board)([]), empty, "should draw an empty board");
  assert.equal(renderBoard(board)(game), gameView, "should draw a board with a game");
} catch (e) {
  console.log(e.message);
  console.log("actual:");
  console.log(e.actual);
  console.log("expected:");
  console.log(e.expected);
}

play(board, []);
