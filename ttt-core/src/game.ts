// prettier-ignore
export type Position = 0 | 1 | 2
                     | 3 | 4 | 5
                     | 6 | 7 | 8;

// prettier-ignore
export type Board = [ Position, Position, Position
                    , Position, Position, Position
                    , Position, Position, Position
                    ];

export type Player = "x" | "o";
export type Move = [Player, Position];
export type Moves = Move[];
export type Win = [Position, Position, Position];

export const isPlayer = (x: string): x is Player => ["x", "o"].includes(x);
export const isPos = (x: number): x is Position =>
  [0, 1, 2, 3, 4, 5, 6, 7, 8].includes(x);

export type Game = {
  result: GameResult;
  moves: Moves;
  nextPlayer: Player;
};

export type GameResult = Tie | Open | Winner;
export type Tie = { kind: "tie" };
export type Winner = { kind: "winner"; winner: Player; move: Win };
export type Open = { kind: "open" };

export const tieGame: GameResult = { kind: "tie" };
export const openGame: GameResult = { kind: "open" };
export const winnerGame = (winner: Player, move: Win): GameResult => ({
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
export const board: Board = [ 0, 1, 2
                            , 3, 4, 5
                            , 6, 7, 8
                            ];

export const isPosTaken = (pos: Position, moves: Moves): boolean =>
  moves.some(([_, p]) => pos === p);

export const createGame = (): Game => ({
  result: resolveGame([]),
  moves: [],
  nextPlayer: nextPlayer([])
});

export const findWin = (player: Player, game: Moves): Win | undefined => {
  const playerMoves = game
    .filter(([candidate]) => player === candidate)
    .map(([_, pos]) => pos);

  return winningMoves.find(
    win => playerMoves.filter(move => win.includes(move)).length === win.length
  );
};

export const resolveGame = (moves: Moves): GameResult => {
  const xWinningMove = findWin("x", moves);
  const oWinningMove = findWin("o", moves);

  if (xWinningMove) {
    return winnerGame("x", xWinningMove);
  } else if (oWinningMove) {
    return winnerGame("o", oWinningMove);
  } else if (moves.length === board.length) {
    return tieGame;
  } else {
    return openGame;
  }
};

export const nextPlayer = (moves: Moves): Player => {
  const [lastMove] = moves;
  if (lastMove) {
    return lastMove[0] === "x" ? "o" : "x";
  } else {
    return ["x", "o"][randInt(0, 1)] as Player;
  }
};

export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
