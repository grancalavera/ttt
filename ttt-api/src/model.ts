import { CoreGame, CoreMove, CorePlayer, CorePosition } from "@grancalavera/ttt-core";

export enum ErrorCode {
  NotFound = "the requested game does not exist",
  GameOver = "game over: the requested game is over",
  WrongTurn = "wrong player: not this player's turn",
  WrongMove = "wrong move: position already taken",
  InvalidMove = "invalid move: either the Player or the Position are invalid"
}

export type GameResponse = {
  id: string;
  game: CoreGame;
};

export type MovesResponse = {
  id: string;
  moves: CoreMove[];
};

export type ErrorResponse = {
  code: ErrorCode;
  message: string;
  context: any;
};

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
