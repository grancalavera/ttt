import { CoreMove, CorePlayer, CorePosition } from "@grancalavera/ttt-core";

export interface Move {
  readonly gameId: string;
  readonly coreMove: CoreMove;
}

export type GameResponse = {
  id: string;
  isGameOver: boolean;
  moves: CoreMove[];
  currentPlayer?: CorePlayer;
  winner?: CorePlayer;
};

export type MoveResponse = {
  id: string;
  gameId: string;
  player: CorePlayer;
  position: CorePosition;
};
