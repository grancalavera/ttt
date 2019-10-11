import { CoreMove, CorePlayer, CorePosition } from "@grancalavera/ttt-core";

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
