import { Move, Game } from "model";

export const validateMove = (g: Game, m: Move): boolean => {
  throw new Error("not implemented");
};

export const validateRange = (size: number) => ([_, position]: Move): boolean =>
  0 <= position && position < size * size;
