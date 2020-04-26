export interface Valid<T> {
  kind: "ValidationValid";
  data: T;
}

export interface Invalid<T> {
  kind: "ValidationInvalid";
  errors: T[];
}

export type Validation<Data, Error> = Valid<Data> | Invalid<Error>;

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
): result is Invalid<E> => result.kind === "ValidationInvalid";

export const combineWith = <T extends unknown, E extends unknown>(
  merge: (l: T, r: T) => T
) => (results: Validation<T, E>[]): Validation<T, E> =>
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

export const combine = <T extends unknown, E extends unknown>(
  results: Validation<T, E>[]
) => combineWith<T, E>(pickLatest)(results);

const isEmpty = <T extends unknown, E extends unknown>(
  result: Validation<T, E>
): boolean => isInvalid(result) && result.errors.length === 0;

function pickLatest<T extends unknown>(_: T, latest: T) {
  return latest;
}
