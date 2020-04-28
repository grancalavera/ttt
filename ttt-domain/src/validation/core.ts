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
