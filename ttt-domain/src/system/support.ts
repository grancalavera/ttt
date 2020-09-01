export interface GameSettings {
  readonly gameSize: number;
  readonly maxActiveMatches: number;
  readonly maxMoves: number;
  readonly winSequences: number[][];
}
