import { Position } from "./model";

type WinMove = [Position, Position, Position];

const winMoves: WinMove[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 8]
];
