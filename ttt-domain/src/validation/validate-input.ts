import { combine } from "./combine";
import { invalid, Validation, valid } from "./core";

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

export const validations = <Input>(validations: ValidateInput<Input>[]) => (
  input: Input
): Validation<Input, InvalidInput<Input>[]> =>
  combine(validations.map((v: ValidateInput<Input>) => v(input)));
