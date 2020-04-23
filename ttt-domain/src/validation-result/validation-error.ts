import { Invalid, ValidationResult } from "./types";

export class ValidationError extends Error {
  constructor(message: string, readonly validationResult: ValidationResult<Invalid>) {
    super(message);
  }
}
