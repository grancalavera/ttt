import { ok } from "assert";

// prettier-ignore
type Pos = 0 | 1 | 2
         | 3 | 4 | 5
         | 6 | 7 | 8;

type Player = "x" | "o";
type Win = [Pos, Pos, Pos];

type Move = [Player, Pos];
type Game = Move[];

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

const game: Game = [["x", 0], ["o", 2], ["x", 3], ["o", 7], ["x", 6]];

ok(isXWinner(game), "x should win the game");
ok(!isOWinner(game), "o should loose the game");

const nextPos = (game: Game): Pos => {
  const played = game.map(([_, p]) => p);
  const moves = board.filter(p => !played.includes(p));
  const min = 0;
  const max = moves.length - 1;
  const move = randInt(min, max);
  return moves[move];
};

const nextPlayer = (p: Player): Player => (p === "x" ? "o" : "x");

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const play = (game: Game): Game => {
  const [lastMove] = game;
  const player = lastMove ? nextPlayer(lastMove[0]) : "x";
  const pos = nextPos(game);
  const move: Move = [player, pos];
  return [move, ...game];
};
