import {
  Position,
  board,
  randInt,
  nextPlayer,
  resolveGame,
  Board,
  Move,
  GAME_OVER_WIN,
  GAME_OVER_TIE,
  GAME_PLAYING
} from "./game";

const turn = (positions: Position[], moves: Move[]): [Position[], Move[]] => {
  const [pos, ...restPos] = positions;
  const player = nextPlayer(moves);
  const move: Move = [player, pos];
  return [restPos, [move, ...moves]];
};

const shuffledPositions = () => {
  const shuffle = (positions: number[]): Position[] => {
    if (positions.length === 0) {
      return [];
    } else {
      const i = randInt(0, positions.length - 1);
      const x = positions[i] as Position;
      const rest = [...positions.slice(0, i), ...positions.slice(i + 1)];
      return [x, ...shuffle(rest)];
    }
  };
  return shuffle([...Array(9)].map((_, i) => i));
};

export const play = (positions: Position[] = shuffledPositions(), moves: Move[] = []) => {
  console.log(renderGame(board)(moves));
  const result = resolveGame(moves);
  const gameOver = (message: string) => console.log(`Game over: ${message}`);

  switch (result.kind) {
    case GAME_OVER_WIN:
      gameOver(`the ${result.winner}'s won the game`);
      break;
    case GAME_OVER_TIE:
      gameOver("tie");
      break;
    case GAME_PLAYING:
      const [ps, ms] = turn(positions, moves);
      setTimeout(() => play(ps, ms), 50);
      break;
    default:
      assertNever(result);
  }
};

const gameToBoardView = (board: Board, moves: Move[]): string[] =>
  board.map(i => {
    const maybeMove = moves.find(([_, x]) => x === i);
    if (maybeMove) {
      return maybeMove[0];
    } else {
      return " ";
    }
  });

export const renderGame = (board: Board) => (moves: Move[]): string => {
  const b = gameToBoardView(board, moves);
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

function assertNever(x: never) {
  throw new Error(`unexpected object ${x}`);
}
