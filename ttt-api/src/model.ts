import { CoreGame, CoreMove } from "@grancalavera/ttt-core";

export enum ErrorCode {
  NotFound = "the requested game does not exist",
  GameOver = "game over: the requested game is over",
  WrongTurn = "wrong player: not this player's turn",
  WrongMove = "wrong move: position already taken",
  InvalidMove = "invalid move: either the Player or the Position are invalid"
}

export interface GameResponse {
  id: string;
  game: CoreGame;
}

export interface MovesResponse {
  id: string;
  moves: CoreMove[];
}

export interface ErrorResponse {
  code: ErrorCode;
  message: string;
  context: any;
}
