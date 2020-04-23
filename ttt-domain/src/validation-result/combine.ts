import { flatten, flow, uniqBy } from "lodash/fp";
import { Invalid, ValidationResult } from "./types";

export const combine = <T extends Invalid>(
  results: ValidationResult<T>[]
): ValidationResult<T> => flow([flatten, uniqByMessage])(results);

const uniqByMessage = uniqBy<Invalid>(({ message }) => message);
