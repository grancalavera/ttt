// prettier-ignore
export type Pos = 0 | 1 | 2
                | 3 | 4 | 5
                | 6 | 7 | 8;

// prettier-ignore
export type Board = [ Pos, Pos, Pos
                    , Pos, Pos, Pos
                    , Pos, Pos, Pos
                    ];

export type Player = "x" | "o";
export type Move = [Player, Pos];
export type Match = Move[];
export type Win = [Pos, Pos, Pos];

type GameResult = Tie | Open | Winner;
type Tie = { kind: "tie" };
type Winner = { kind: "winner"; winner: Player; move: Win };
type Open = { kind: "open" };

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

export const findWin = (player: Player, game: Match): Win | undefined => {
  const playerMoves = game
    .filter(([candidate]) => player === candidate)
    .map(([_, pos]) => pos);

  return winningMoves.find(
    win => playerMoves.filter(move => win.includes(move)).length === win.length
  );
};

export const resolveGame = (game: Match): GameResult => {
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

export const nextPlayer = (game: Match): Player => {
  const [lastMove] = game;
  if (lastMove) {
    return lastMove[0] === "x" ? "o" : "x";
  } else {
    return ["x", "o"][randInt(0, 1)] as Player;
  }
};

export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
