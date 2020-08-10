export type NonEmptyArray<T> = [T, ...T[]];

export const isNonEmptyArray = <T>(candidate: T[]): candidate is NonEmptyArray<T> =>
  candidate.length > 0;
