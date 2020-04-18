import { Move, Game } from "model";

export const validMove = (g: Game, m: Move): boolean => {
  throw new Error("not implemented");
};

export const validRange = (size: number) => ([_, position]: Move): boolean =>
  0 <= position && position < size * size;
