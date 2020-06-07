import { Result } from "result";
import { combine } from "./combine";
import { invalid, valid, Validation } from "./core";

export type InputValidation<Input, Result> = Validation<Result, InvalidInput<Input>>;

export type ValidateInput<Input, Output = Input> = (
  input: Input
) => Validation<Output, InvalidInput<Input>[]>;

export interface InvalidInput<T> {
  message: string;
  input: T;
}

export const invalidInput = (message: string) => <Input, Output = Input>(
  input: Input
): Validation<Output, InvalidInput<Input>> => invalid({ message, input });

export const validInput: Result<void, never> = valid(undefined);

export const validations = <Input>(validations: ValidateInput<Input>[]) => (
  input: Input
): Validation<Input, InvalidInput<Input>[]> =>
  combine(validations.map((v: ValidateInput<Input>) => v(input)));
