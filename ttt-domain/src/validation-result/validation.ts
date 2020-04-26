import { Validation, Valid, Invalid_ } from "./types";

export const valid = <T extends unknown>(data: T): Validation<T, never> => {
  return { kind: "ValidationValid", data };
};

export const invalid = <E extends unknown>(e: E | E[]): Validation<never, E> => {
  return { kind: "ValidationInvalid", errors: Array.isArray(e) ? e : [e] };
};

export const isValid = <T extends unknown, E extends unknown>(
  result: Validation<T, E>
): result is Valid<T> => result.kind === "ValidationValid";

export const isInvalid = <T extends unknown, E extends unknown>(
  result: Validation<T, E>
): result is Invalid_<E> => result.kind === "ValidationInvalid";

/**
 * Combine a list of validation results.
 * When all results are valid the data from the last result is kept.
 * When the first invalid result is found, errors are accumulated from
 * that point onwards and all data on subsequent valid results are dropped.
 */
export const combine = <T extends unknown, E extends unknown>(
  results: Validation<T, E>[],
  merge: (l: T, r: T) => T = pickLatest
): Validation<T, E> =>
  results.reduce((combined, result) => {
    if (isEmpty(combined)) {
      return result;
    }

    if (isInvalid(combined)) {
      if (isInvalid(result)) {
        return invalid([...combined.errors, ...result.errors]);
      } else {
        return combined;
      }
    } else {
      if (isInvalid(result)) {
        return result;
      } else {
        return valid(merge(combined.data, result.data));
      }
    }
  }, invalid([]));

const pickLatest = <T extends unknown>(_: T, latest: T) => latest;

const isEmpty = <T extends unknown, E extends unknown>(
  result: Validation<T, E>
): boolean => isInvalid(result) && result.errors.length === 0;
