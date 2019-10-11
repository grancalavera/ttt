import { CoreMove, CorePlayer, CorePosition } from "@grancalavera/ttt-core";

export type ResponseGame = {
  id: string;
  isGameOver: boolean;
  moves: CoreMove[];
  currentPlayer?: CorePlayer;
  winner?: CorePlayer;
};

export type ResponseMove = {
  id: string;
  gameId: string;
  player: CorePlayer;
  position: CorePosition;
};
