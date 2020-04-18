import { columns, diagonals, rows } from "game/board";
import { Move, Winner, Position, Player } from "model";

export const winners = (size: number, ms: Move[]): Winner[] =>
  wins(size)
    .map(toMaybeWinner(ms))
    .filter(Boolean) as Winner[];

const wins = (size: number) => {
  const rs = rows(size);
  const cs = columns(size);
  const dg = diagonals(size);
  return [...rs, ...cs, ...dg];
};

const toMaybeWinner = (ms: Move[]) => (win: Position[]): Winner | undefined => {
  interface Result {
    lastMove?: Move;
    winner?: Player;
  }

  const result = win
    .map((wPos) => ms.find(([_, mPos]) => wPos === mPos))
    .reduce(({ lastMove, winner }, thisMove) => {
      if (lastMove === undefined) {
        return { lastMove: thisMove, winner: thisMove?.[0] };
      } else if (thisMove === undefined) {
        return { lastMove: thisMove };
      } else {
        const [thisPlayer] = thisMove;
        return {
          lastMove: thisMove,
          winner: winner === thisPlayer ? thisPlayer : undefined,
        };
      }
    }, {} as Result);

  if (result.winner) {
    const winner: Winner = [result.winner, win];
    return winner;
  }
};
