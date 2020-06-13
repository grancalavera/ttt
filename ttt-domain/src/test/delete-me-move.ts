import { MoveInput } from "move/validation";

export interface MoveScenario {
  name: string;
  input: MoveInput;
  toValidation: any;
}
