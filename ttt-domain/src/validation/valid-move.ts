import { Move } from "model";

export const validRange = (size: number) => ([_, position]: Move): boolean =>
  0 <= position && position < size * size;
