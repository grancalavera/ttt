import * as r from "result";

export type Validation<T, E> = r.Result<T, E[]>;
export type Valid<T> = r.Success<T>;
export type Invalid<E> = r.Failure<E[]>;

export const valid = r.success;
export const invalid = <E>(errors: E[]) => r.failure(errors);
export const isValid = r.isSuccess;
export const isInvalid = r.isFailure;
export const getValid = r.getSuccess;
export const getInvalid = r.getFailure;
