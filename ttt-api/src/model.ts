import { CoreMove, CorePlayer, CorePosition } from "@grancalavera/ttt-core";
import {
  MissingGameId,
  GameNotFound,
  InvalidPosition,
  PositionPlayedError,
  WrongTurn,
  GameOver,
  InvalidRequest,
  PositionPlayed,
} from "./exceptions";

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

export type ErrorResponse =
  | MissingGameId
  | GameNotFound
  | InvalidPosition
  | InvalidPosition
  | PositionPlayed
  | GameOver
  | WrongTurn
  | InvalidRequest;

export type MoveResponse = {
  id: string;
  gameId: string;
  player: CorePlayer;
  position: CorePosition;
};

export const isGameResponse = (x: any): x is GameResponse => {
  const mustHave = ["id", "isGameOver", "moves"];
  const actualKeys = Object.keys(x || {});
  return mustHave.every(key => actualKeys.includes(key));
};

export const isErrorResponse = (x: any): x is ErrorResponse => {
  return !!x.errors && x.errors.length;
};
