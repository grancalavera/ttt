import assert from "assert";

// prettier-ignore
type Board = [ Pos, Pos, Pos
             , Pos, Pos, Pos
             , Pos, Pos, Pos
             ];

// prettier-ignore
type Pos = 0 | 1 | 2
         | 3 | 4 | 5
         | 6 | 7 | 8;

type Player = "x" | "o";
type Move = [Player, Pos];
type Game = Move[];
type Win = [Pos, Pos, Pos];

type GameResult = Tie | Open | Winner;
type Tie = { kind: "tie" };
type Winner = { kind: "winner"; winner: Player; move: Win };
type Open = { kind: "open" };

const tieGame: GameResult = { kind: "tie" };
const openGame: GameResult = { kind: "open" };
const winnerGame = (winner: Player, move: Win): GameResult => ({
  kind: "winner",
  winner,
  move
});

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

// prettier-ignore
const board: Board = [ 0, 1, 2
                     , 3, 4, 5
                     , 6, 7, 8
                     ];

const findWin = (player: Player, game: Game): Win | undefined => {
  const playerMoves = game
    .filter(([candidate]) => player === candidate)
    .map(([_, pos]) => pos);

  return winningMoves.find(
    win => playerMoves.filter(move => win.includes(move)).length === 3
  );
};

const resolveGame = (game: Game): GameResult => {
  const xWinningMove = findWin("x", game);
  const oWinningMove = findWin("o", game);

  if (xWinningMove) {
    return winnerGame("x", xWinningMove);
  } else if (oWinningMove) {
    return winnerGame("o", oWinningMove);
  } else if (game.length === board.length) {
    return tieGame;
  } else {
    return openGame;
  }
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

// simulation

const chooseRandomPos = (game: Game): Pos => {
  const played = game.map(([_, p]) => p);
  const moves = board.filter(p => !played.includes(p));
  const min = 0;
  const max = moves.length - 1;
  const move = randInt(min, max);
  return moves[move];
};

const turn = (game: Game): Game => {
  const player = nextPlayer(game);
  const pos = chooseRandomPos(game);
  const move: Move = [player, pos];
  return [move, ...game];
};

const play = (game: Game): void => {
  console.log(renderGame(board)(game));

  const result = resolveGame(game);
  const gameOver = (message: string) => console.log(`Game over: ${message}`);

  switch (result.kind) {
    case "winner":
      console.log(gameOver(`the ${result.winner}'s won the game`));
      break;
    case "tie":
      console.log(gameOver("tie"));
      break;
    case "open":
      setTimeout(() => play(turn(game)), 50);
      break;
    default:
      assertNever(result);
  }
};

function assertNever(x: never) {
  throw new Error(`unexpected object ${x}`);
}

const gameToBoardView = (board: Board, game: Game): string[] =>
  board.map(i => {
    const maybeMove = game.find(([_, x]) => x === i);
    if (maybeMove) {
      return maybeMove[0];
    } else {
      return " ";
    }
  });

const renderGame = (board: Board) => (game: Game): string => {
  const b = gameToBoardView(board, game);
  return `
┌─────────────────┐
│                 │
│    ${b[0]} │ ${b[1]} │ ${b[2]}    │
│   ───┼───┼───   │
│    ${b[3]} │ ${b[4]} │ ${b[5]}    │
│   ───┼───┼───   │
│    ${b[6]} │ ${b[7]} │ ${b[8]}    │
│                 │
└─────────────────┘
`;
};

const gameFromString = (s: String): Game => {
  return <Game>s
    .trim()
    .replace(/\n|\./g, "")
    .split("")
    .map((p, i) => [p, i])
    .filter(([p, _]) => p !== " ");
};

const gameForX: Game = gameFromString(`
x o.
x  .
xo .
`);

const gameForO: Game = gameFromString(`
o x.
o  .
ox .
`);

const gameIsOpen: Game = [];

const gameIsTie: Game = gameFromString(`
xox.
oxo.
oxo.
`);

const emptyBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
const gameBoard = ["x", " ", "o", "x", " ", " ", "x", "o", " "];

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

try {
  // game
  assert.deepEqual(
    gameFromString(`
x o.
x  .
xo .
`),
    [["x", 0], ["o", 2], ["x", 3], ["x", 6], ["o", 7]],
    "should create a game from a string"
  );

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

  // rendering

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
} catch (e) {
  console.log(e.message);
  console.log();
  console.log("actual:");
  console.log(e.actual);
  console.log("expected:");
  console.log(e.expected);
  process.exit(1);
}

play([]);
