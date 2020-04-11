// prettier-ignore
export type CorePosition = 0 | 1 | 2
                         | 3 | 4 | 5
                         | 6 | 7 | 8;

// prettier-ignore
export type CoreBoard = [ CorePosition, CorePosition, CorePosition
                        , CorePosition, CorePosition, CorePosition
                        , CorePosition, CorePosition, CorePosition
                        ];

export type CorePlayer = "O" | "X";
export type CoreMove = [CorePlayer, CorePosition];
export type CoreWin = [CorePosition, CorePosition, CorePosition];

export type CoreGame = CoreGamePlaying | CoreGameOverTie | CoreGameOverWin;
export type CoreGameState = CoreGame["kind"];

export const CORE_GAME_PLAYING = "CoreGamePlaying";
export const CORE_GAME_OVER_TIE = "CoreGameOverTie";
export const CORE_GAME_OVER_WIN = "CoreGameOverWin";

export interface CoreGamePlaying {
  kind: typeof CORE_GAME_PLAYING;
  currentPlayer: CorePlayer;
  moves: CoreMove[];
}

export interface CoreGameOverTie {
  kind: typeof CORE_GAME_OVER_TIE;
  moves: CoreMove[];
}

export interface CoreGameOverWin {
  kind: typeof CORE_GAME_OVER_WIN;
  winner: CorePlayer;
  moves: CoreMove[];
  winningMove: CoreWin;
}

type FMap = <T, U>(x: T) => U;

export type Maybe<T> = Just<T> | Nothing;
export type Just<T> = T;
export type Nothing = null | undefined;

export const just = <T>(value: T): Maybe<T> => value;

export const nothing = <T>(): Maybe<T> => null;

export const isJust = <T>(candidate: Maybe<T>): candidate is Just<T> => {
  return candidate !== undefined || candidate !== null;
};

export const isNothing = <T>(candidate: Maybe<T>): candidate is Nothing => {
  return candidate === undefined || candidate === null;
};

export const maybe = <T, U>(defaultValue: U) => (map: FMap) => (value: Maybe<T>): U =>
  isJust(value) ? map(value) : defaultValue;

const gameOverWin = (result: Omit<CoreGameOverWin, "kind">): CoreGameOverWin => ({
  kind: CORE_GAME_OVER_WIN,
  ...result,
});

const gameOverTie = (result: Omit<CoreGameOverTie, "kind">): CoreGameOverTie => ({
  kind: CORE_GAME_OVER_TIE,
  ...result,
});

const nextTurn = (result: Omit<CoreGamePlaying, "kind">): CoreGamePlaying => ({
  kind: CORE_GAME_PLAYING,
  ...result,
});

const winningMoves: CoreWin[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const coerce = <T, U extends T>(
  isCoercible: (value: T) => value is U,
  discard: (discarded: T) => string = (discarded) =>
    `type coercion for ${discarded} failed`
) => (candidate: T): U => {
  if (isCoercible(candidate)) {
    return candidate;
  } else {
    throw new Error(discard(candidate));
  }
};

export const isPlayer = (x: string): x is CorePlayer => ["X", "O"].includes(x);

export const isPos = (x: number): x is CorePosition =>
  [0, 1, 2, 3, 4, 5, 6, 7, 8].includes(x);

export const isGameState = (x: string): x is CoreGameState =>
  [CORE_GAME_PLAYING, CORE_GAME_OVER_TIE, CORE_GAME_OVER_WIN].includes(x);

export const isMove = (x: [string, number]): x is CoreMove => {
  const [maybePlayer, maybePosition] = x;
  return isPlayer(maybePlayer) && isPos(maybePosition);
};

export const coerceToPlayer = coerce(
  isPlayer,
  (discarded) => `coercion failed: ${discarded} is not a valid Player`
);

export const coerceToPosition = coerce(
  isPos,
  (discarded) => `coercion failed: ${discarded} is not a valid Position`
);

export const coerceToGameState = coerce(
  isGameState,
  (discarded) => `coercion failed: ${discarded} is not a valid GameState`
);

export const coerceToMove = coerce(
  isMove,
  ([player, position]) =>
    `invalid Move:
either ${player} is an invalid Player
or ${position} is an invalid Position`
);

// prettier-ignore
const coreBoard: CoreBoard = [ 0, 1, 2
                             , 3, 4, 5
                             , 6, 7, 8
                             ];

export const isPosTaken = (pos: CorePosition, moves: CoreMove[]): boolean =>
  moves.some(([_, p]) => pos === p);

export const createGame = (): CoreGamePlaying => ({
  kind: CORE_GAME_PLAYING,
  moves: [],
  currentPlayer: nextPlayer([]),
});

export const findWin = (player: CorePlayer, game: CoreMove[]): CoreWin | undefined => {
  const playerMoves = game
    .filter(([candidate]) => player === candidate)
    .map(([_, pos]) => pos);

  return winningMoves.find(
    (win) => playerMoves.filter((move) => win.includes(move)).length === win.length
  );
};

export const resolveGame = (moves: CoreMove[]): CoreGame => {
  const xWinningMove = findWin("X", moves);
  const oWinningMove = findWin("O", moves);

  if (xWinningMove) {
    const winningMove = xWinningMove;
    const winner = "X";
    return gameOverWin({ winner, winningMove, moves });
  } else if (oWinningMove) {
    const winningMove = oWinningMove;
    const winner = "O";
    return gameOverWin({ winner, winningMove, moves });
  } else if (moves.length === coreBoard.length) {
    return gameOverTie({ moves });
  } else {
    return nextTurn({ currentPlayer: nextPlayer(moves), moves });
  }
};

export const nextPlayer = (moves: CoreMove[]): CorePlayer => {
  const [lastMove] = moves;
  if (lastMove) {
    return lastMove[0] === "X" ? "O" : "X";
  } else {
    return coerceToPlayer(["X", "O"][randInt(0, 1)]);
  }
};

export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function assertNever(value: never): never {
  throw new Error(`unexpected value ${value}`);
}

export const shuffle = <T extends any>(list: T[]): T[] => {
  if (list.length === 0) {
    return [];
  } else {
    const i = randInt(0, list.length - 1);
    const x = list[i];
    const rest = [...list.slice(0, i), ...list.slice(i + 1)];
    return [x, ...shuffle(rest)];
  }
};

const gameToBoardView = (board: CoreBoard, moves: CoreMove[]): string[] =>
  board.map((i) => {
    const maybeMove = moves.find(([_, x]) => x === i);
    if (maybeMove) {
      return maybeMove[0];
    } else {
      return " ";
    }
  });

export const renderGame = (moves: CoreMove[]): string => {
  const b = gameToBoardView(coreBoard, moves);
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
