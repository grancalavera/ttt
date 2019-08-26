import {
  CoreMove,
  CorePosition,
  CORE_GAME_OVER_TIE,
  CORE_GAME_OVER_WIN,
  CORE_GAME_PLAYING,
  nextPlayer,
  randInt,
  renderGame,
  resolveGame
} from "./game";

const turn = (
  positions: CorePosition[],
  moves: CoreMove[]
): [CorePosition[], CoreMove[]] => {
  const [pos, ...restPos] = positions;
  const player = nextPlayer(moves);
  const move: CoreMove = [player, pos];
  return [restPos, [move, ...moves]];
};

const shuffledPositions = () => {
  const shuffle = (positions: number[]): CorePosition[] => {
    if (positions.length === 0) {
      return [];
    } else {
      const i = randInt(0, positions.length - 1);
      const x = positions[i] as CorePosition;
      const rest = [...positions.slice(0, i), ...positions.slice(i + 1)];
      return [x, ...shuffle(rest)];
    }
  };
  return shuffle([...Array(9)].map((_, i) => i));
};

export const play = (
  positions: CorePosition[] = shuffledPositions(),
  moves: CoreMove[] = []
) => {
  console.log(renderGame(moves));
  const result = resolveGame(moves);
  const gameOver = (message: string) => console.log(`Game over: ${message}`);

  switch (result.kind) {
    case CORE_GAME_OVER_WIN:
      gameOver(`the ${result.winner}'s won the game`);
      break;
    case CORE_GAME_OVER_TIE:
      gameOver("tie");
      break;
    case CORE_GAME_PLAYING:
      const [ps, ms] = turn(positions, moves);
      setTimeout(() => play(ps, ms), 50);
      break;
    default:
      assertNever(result);
  }
};

function assertNever(x: never) {
  throw new Error(`unexpected object ${x}`);
}
