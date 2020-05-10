export type Either<L, R> = Left<L> | Right<R>;
export type Left<T> = { kind: "Left"; value: T };
export type Right<T> = { kind: "Right"; value: T };

export const left = <T extends unknown>(value: T): Left<T> => ({ kind: "Left", value });
export const right = <T extends unknown>(value: T): Right<T> => ({
  kind: "Right",
  value,
});

export const isLeft = <L extends unknown, R extends unknown>(
  candidate: Either<L, R>
): candidate is Left<L> => candidate.kind === "Left";

export const isRight = <L extends unknown, R extends unknown>(
  candidate: Either<L, R>
): candidate is Right<R> => candidate.kind === "Right";

export const lefts = <L extends unknown, R extends unknown>(
  eithers: Either<L, R>[]
): L[] => eithers.filter(isLeft).map(({ value }) => value);

export const rights = <L extends unknown, R extends unknown>(
  eithers: Either<L, R>[]
): R[] => eithers.filter(isRight).map(({ value }) => value);
