import { columns, diagonals, Matrix, rows } from "./board";

interface Scenario {
  side: number;
  expected: {
    rows: Matrix;
    columns: Matrix;
    diagonals: Matrix;
  };
}

const scenarios: Scenario[] = [
  {
    side: 0,
    expected: {
      rows: [],
      columns: [],
      diagonals: [[], []],
    },
  },
  {
    side: 1,
    expected: {
      rows: [[0]],
      columns: [[0]],
      diagonals: [[0], [0]],
    },
  },
  {
    side: 2,
    expected: {
      rows: [
        [0, 1],
        [2, 3],
      ],
      columns: [
        [0, 2],
        [1, 3],
      ],
      diagonals: [
        [0, 3],
        [1, 2],
      ],
    },
  },
  {
    side: 3,
    expected: {
      rows: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ],
      columns: [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
      ],
      diagonals: [
        [0, 4, 8],
        [2, 4, 6],
      ],
    },
  },
  {
    side: 4,
    expected: {
      rows: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
      ],
      columns: [
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
      ],
      diagonals: [
        [0, 5, 10, 15],
        [3, 6, 9, 12],
      ],
    },
  },
];

describe.each(scenarios)("board structure", (scenario) => {
  const { side, expected } = scenario;

  it(`should calculate rows for a ${side} x ${side} board`, () => {
    const actual = rows(side);
    expect(actual).toEqual(expected.rows);
  });

  it(`should calculate columns for a ${side} x ${side} board`, () => {
    const actual = columns(side);
    expect(actual).toEqual(expected.columns);
  });

  it(`should calculate diagonals for a ${side} x ${side} board`, () => {
    const actual = diagonals(side);
    expect(actual).toEqual(expected.diagonals);
  });
});
