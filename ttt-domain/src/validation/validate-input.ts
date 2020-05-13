import { combine } from "./combine";
import { invalid, Validation } from "./core";

export type InputValidation<Input, Result> = Validation<Result, InvalidInput<Input>>;

export type ValidateInput<Input> = (
  input: Input
) => Validation<Input, InvalidInput<Input>>;

export interface InvalidInput<T> {
  message: string;
  input: T;
}

export const invalidInput = (message: string) => <Input extends unknown>(
  input: Input
): Validation<Input, InvalidInput<Input>> => {
  return invalid({ message, input });
};

export const validations = <Input extends unknown>(
  validations: ValidateInput<Input>[]
) => (input: Input): Validation<Input, InvalidInput<Input>> => {
  return combine(validations.map((v: ValidateInput<Input>) => v(input)));
};
