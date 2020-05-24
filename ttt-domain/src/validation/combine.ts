import { invalid, isInvalid, valid, Validation } from "./core";

export const combineWith = <T extends unknown, E extends unknown>(
  merge: (l: T, r: T) => T
) => (results: Validation<T, E>[]): Validation<T, E> =>
  results.reduce((combined, result) => {
    if (isEmpty(combined)) {
      return result;
    }

    if (isInvalid(combined)) {
      if (isInvalid(result)) {
        return invalid([...combined.left, ...result.left]);
      } else {
        return combined;
      }
    } else {
      if (isInvalid(result)) {
        return result;
      } else {
        return valid(merge(combined.right, result.right));
      }
    }
  }, invalid([]));

export const combine = <T extends unknown, E extends unknown>(
  results: Validation<T, E>[]
) => combineWith<T, E>((_, latest) => latest)(results);

const isEmpty = <T extends unknown, E extends unknown>(
  result: Validation<T, E>
): boolean => isInvalid(result) && result.left.length === 0;
