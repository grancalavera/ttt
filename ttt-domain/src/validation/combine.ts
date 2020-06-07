import { invalid, isInvalid, valid, Validation, getInvalid, getValid } from "./core";
import { InvalidInput } from "./validate-input";

export const combineWith = <T, E>(merge: (l: T, r: T) => T) => (
  results: Validation<T, E[]>[]
): Validation<T, E[]> =>
  results.reduce((combined, result) => {
    if (isEmpty(combined)) {
      return result;
    }

    if (isInvalid(combined)) {
      if (isInvalid(result)) {
        return invalid([...getInvalid(combined), ...getInvalid(result)]);
      } else {
        return combined;
      }
    } else {
      if (isInvalid(result)) {
        return result;
      } else {
        return valid(merge(getValid(combined), getValid(result)));
      }
    }
  }, invalid([]));

export const combine = <T, E>(results: Validation<T, E[]>[]) => {
  return combineWith<T, E>((_, latest) => latest)(results);
};

const isEmpty = <T, E>(result: Validation<T, E[]>): boolean =>
  isInvalid(result) && getInvalid(result).length === 0;

declare const r: Validation<number, InvalidInput<number>[]>[];
