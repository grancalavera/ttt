import { Move } from "@grancalavera/ttt-schema";

export type CellState = FreeCell | PlayedCell | DisabledCell;

export type FreeCell = {
  kind: "free";
  move: Move;
};

export type PlayedCell = {
  kind: "played";
  move: Move;
};

export type DisabledCell = {
  kind: "disabled";
};
