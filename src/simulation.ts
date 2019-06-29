import { Game, Pos, board, randInt, nextPlayer, resolveGame, Board, Move } from "./game";

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

export const play = (game: Game): void => {
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

const gameToBoardView = (board: Board, game: Game): string[] =>
  board.map(i => {
    const maybeMove = game.find(([_, x]) => x === i);
    if (maybeMove) {
      return maybeMove[0];
    } else {
      return " ";
    }
  });

export const renderGame = (board: Board) => (game: Game): string => {
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

function assertNever(x: never) {
  throw new Error(`unexpected object ${x}`);
}
