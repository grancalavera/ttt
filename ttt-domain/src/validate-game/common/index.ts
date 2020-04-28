import { Move } from "model";

export const isMoveInsideRange = (size: number) => ([_, position]: Move): boolean =>
  0 <= position && position < size * size;
