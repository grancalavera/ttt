import * as r from "result";
export { sequence } from "./sequence";

export type Validation<T, E> = r.Result<T, E>;
export type Valid<T> = r.Success<T>;
export type Invalid<E> = r.Failure<E>;

export const valid = r.success;
export const invalid = r.failure;
export const isValid = r.isSuccess;
export const isInvalid = r.isFailure;
export const getValid = r.getSuccess;
export const getInvalid = r.getFailure;

export type InputValidation<Input, Result> = Validation<Result, InvalidInput<Input>>;

export type ValidateInput<Input, Output = Input> = (
  input: Input
) => Validation<Output, InvalidInput<Input>[]>;

export interface InvalidInput<T> {
  message: string;
  input: T;
}

export const invalidInput = (message: string) => <T>(input: T): InvalidInput<T> => ({
  message,
  input,
});

export const failWithInvalidInput = <T>(messageFn: (input: T) => InvalidInput<T>) => (
  input: T
) => invalid(messageFn(input));

export const allow: Validation<void, never> = valid(undefined);
