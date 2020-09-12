export type Matrix = number[][]

export const rows = (size: number): Matrix =>
  board(size)
    .reduce((rows, cell) => {
      if (cell % size === 0) {
        return [[cell], ...rows]
      } else {
        const [row, ...rest] = rows
        return [[...row, cell], ...rest]
      }
    }, [] as Matrix)
    .reverse()

export const columns = (size: number): Matrix => transpose(rows(size))

export const diagonals = (size: number): Matrix =>
  rows(size).reduce(
    (diagonals, row, i) => {
      return [
        [...diagonals[0], row[i]],
        [...diagonals[1], row[size - i - 1]],
      ] as Matrix
    },
    [[], []] as Matrix,
  )

const transpose = (xs: Matrix): Matrix => {
  const transposed: Matrix = []
  xs.forEach((a, i) => {
    a.forEach((b, j) => {
      transposed[j] = transposed[j] ?? []
      transposed[j][i] = b
    })
  })
  return transposed
}

const board = (side: number) => Array.from({ length: side * side }, (_, i) => i)

export const winSequences = (size: number): Matrix => [
  ...rows(size),
  ...columns(size),
  ...diagonals(size),
]
