import { Either, isLeft, isRight, left, right } from "fp-ts/lib/Either";
export type Validation<T, E> = Either<E[], T>;
export const valid = right;
export const invalid = <E>(e: E | E[]) => left(Array.isArray(e) ? e : [e]);
export const isValid = isRight;
export const isInvalid = isLeft;
