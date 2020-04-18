export type Matrix = number[][];
export type Diagonals = [number[], number[]];

export const rows = (side: number): Matrix =>
  board(side)
    .reduce((rows, cell) => {
      if (cell % side === 0) {
        return [[cell], ...rows];
      } else {
        const [row, ...rest] = rows;
        return [[...row, cell], ...rest];
      }
    }, [] as Matrix)
    .reverse();

export const columns = (side: number): Matrix => transpose(rows(side));

export const diagonals = (side: number): Diagonals =>
  rows(side).reduce(
    (diagonals, row, i) =>
      [
        [...diagonals[0], row[i]],
        [...diagonals[1], row[side - i - 1]],
      ] as Diagonals,
    [[], []] as Diagonals
  );

const transpose = (xs: Matrix): Matrix =>
  xs.length === 0
    ? []
    : head(xs).length === 0
    ? transpose(tail(xs))
    : [xs.map(head), ...transpose(xs.map(tail))];

const board = (side: number) => range(side * side);
const range = (length: number) => Array.from({ length }, (_, i) => i);

const head = <T extends unknown>(xs: T[]) => {
  if (xs.length === 0) {
    throw new Error("head is undefined for empty Array");
  }
  return xs[0];
};

const tail = <T extends unknown>(xs: T[]) => {
  const [_, ...t] = xs;
  return t ?? [];
};
