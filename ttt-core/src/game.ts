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
export type Win = [Position, Position, Position];

export type Game = GamePlaying | GameOverTie | GameOverWin;
export type GameState = Game["kind"];

export const GAME_PLAYING = "GamePlaying";
export const GAME_OVER_TIE = "GameOverTie";
export const GAME_OVER_WIN = "GameOverWin";

export interface GamePlaying {
  kind: typeof GAME_PLAYING;
  currentPlayer: Player;
  moves: Move[];
}

export interface GameOverTie {
  kind: typeof GAME_OVER_TIE;
  moves: Move[];
}
export interface GameOverWin {
  kind: typeof GAME_OVER_WIN;
  winner: Player;
  moves: Move[];
  winningMove: Win;
}

const gameOverWin = (result: Omit<GameOverWin, "kind">): GameOverWin => ({
  kind: GAME_OVER_WIN,
  ...result
});

const gameOverTie = (result: Omit<GameOverTie, "kind">): GameOverTie => ({
  kind: GAME_OVER_TIE,
  ...result
});

const nextTurn = (result: Omit<GamePlaying, "kind">): GamePlaying => ({
  kind: GAME_PLAYING,
  ...result
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

const coerce = <T, U extends T>(
  isCoercible: (value: T) => value is U,
  discard: (discarded: T) => string = discarded => `type coercion for ${discarded} failed`
) => (candidate: T): U => {
  if (isCoercible(candidate)) {
    return candidate;
  } else {
    throw new Error(discard(candidate));
  }
};

export const isPlayer = (x: string): x is Player => ["x", "o"].includes(x);

export const isPos = (x: number): x is Position =>
  [0, 1, 2, 3, 4, 5, 6, 7, 8].includes(x);

export const isGameState = (x: string): x is GameState =>
  [GAME_PLAYING, GAME_OVER_TIE, GAME_OVER_WIN].includes(x);

export const isMove = (x: [string, number]): x is Move => {
  const [maybePlayer, maybePosition] = x;
  return isPlayer(maybePlayer) && isPos(maybePosition);
};

export const coerceToPlayer = coerce(
  isPlayer,
  discarded => `${discarded} is not a valid Player`
);

export const coerceToPosition = coerce(
  isPos,
  discarded => `${discarded} is not a valid Position`
);

export const coerceToGameState = coerce(
  isGameState,
  discarded => `${discarded} is not a valid GameState`
);

export const coerceToMove = coerce(
  isMove,
  ([player, position]) =>
    `invalid Move:
either ${player} is an invalid Player
or ${position} is an invalid Position`
);

// prettier-ignore
export const board: Board = [ 0, 1, 2
                            , 3, 4, 5
                            , 6, 7, 8
                            ];

export const isPosTaken = (pos: Position, moves: Move[]): boolean =>
  moves.some(([_, p]) => pos === p);

export const createGame = (): GamePlaying => ({
  kind: GAME_PLAYING,
  moves: [],
  currentPlayer: nextPlayer([])
});

export const findWin = (player: Player, game: Move[]): Win | undefined => {
  const playerMoves = game
    .filter(([candidate]) => player === candidate)
    .map(([_, pos]) => pos);

  return winningMoves.find(
    win => playerMoves.filter(move => win.includes(move)).length === win.length
  );
};

export const resolveGame = (moves: Move[]): Game => {
  const xWinningMove = findWin("x", moves);
  const oWinningMove = findWin("o", moves);

  if (xWinningMove) {
    const winningMove = xWinningMove;
    const winner = "x";
    return gameOverWin({ winner, winningMove, moves });
  } else if (oWinningMove) {
    const winningMove = oWinningMove;
    const winner = "o";
    return gameOverWin({ winner, winningMove, moves });
  } else if (moves.length === board.length) {
    return gameOverTie({ moves });
  } else {
    return nextTurn({ currentPlayer: nextPlayer(moves), moves });
  }
};

export const nextPlayer = (moves: Move[]): Player => {
  const [lastMove] = moves;
  if (lastMove) {
    return lastMove[0] === "x" ? "o" : "x";
  } else {
    return ["x", "o"][randInt(0, 1)] as Player;
  }
};

export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
