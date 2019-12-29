import { CoreMove, CorePlayer, CorePosition, assertNever } from "@grancalavera/ttt-core";
import {
  GameNotFound,
  GameOver,
  InvalidPosition,
  InvalidRequest,
  MissingGameId,
  PositionPlayed,
  WrongTurn,
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

export const isErrorResponse = (candidate?: any): candidate is ErrorResponse => {
  try {
    const c = candidate! as ErrorResponse;
    switch (c.kind) {
      case "GameNotFound":
      case "GameOver":
      case "InvalidPosition":
      case "InvalidRequest":
      case "MissingGameId":
      case "PositionPlayed":
      case "WrongTurn":
        return true;
      default:
        return assertNever(c);
    }
  } catch (e) {
    return false;
  }
};
