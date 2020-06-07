import { columns, diagonals, rows } from "board";
import { Move, Position, Winner } from "model";

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

export const winner = (size: number, ms: Move[]): Winner | undefined =>
  winners(size, ms)[0];

const toMaybeWinner = (ms: Move[]) => (win: Position[]): Winner | undefined => {
  interface Result {
    lastMove?: Move;
    winner?: Winner;
  }

  return win
    .map((wPos) => ms.find(([_, mPos]) => wPos === mPos))
    .reduce(({ lastMove, winner }, thisMove) => {
      if (lastMove === undefined) {
        const thisWinner: Winner | undefined = thisMove ? [thisMove[0], win] : undefined;
        return { lastMove: thisMove, winner: thisWinner };
      } else if (thisMove === undefined) {
        return { lastMove: thisMove };
      } else {
        const [thisPlayer] = thisMove;
        const thisWinner: Winner | undefined =
          winner !== undefined && winner[0] === thisPlayer ? winner : undefined;
        return { lastMove: thisMove, winner: thisWinner };
      }
    }, {} as Result).winner;
};
