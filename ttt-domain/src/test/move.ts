import { MoveInput, ValidateMove } from "move/validation";

export interface MoveScenario {
  name: string;
  input: MoveInput;
  toValidation: ValidateMove;
}
