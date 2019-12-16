import { CorePlayer, CorePosition } from "@grancalavera/ttt-core";

export interface InvalidRequest {
  kind: "InvalidRequest";
  message: string;
  errors: any[];
}

export interface MissingGameId {
  kind: "MissingGameId";
  message: string;
}

export interface GameNotFound {
  kind: "GameNotFound";
  message: string;
  gameId: string;
}

export interface InvalidPlayer {
  kind: "InvalidPlayer";
  invalidPlayer: any;
  message: string;
}

export interface InvalidPosition {
  kind: "InvalidPosition";
  invalidPosition: any;
  message: string;
}

export interface PositionPlayed {
  kind: "PositionPlayed";
  playedByPlayer: CorePlayer;
  playedPosition: CorePosition;
}

export interface GameOver {
  kind: "GameOver";
  gameId: string;
}

export interface WrongTurn {
  kind: "WrongTurn";
  wrongPlayer: CorePlayer;
}

export const invalidRequest = (
  message: string,
  errors: any[] = []
): InvalidRequest => ({
  kind: "InvalidRequest",
  message,
  errors,
});

export const invalidPlayer = (player: any): InvalidPlayer => ({
  kind: "InvalidPlayer",
  message: `Invalid player "${player}, valid players are "O" and "X" only`,
  invalidPlayer: player,
});

export const invalidPosition = (position: any): InvalidPosition => ({
  kind: "InvalidPosition",
  message: `Invalid position "${position}", valid moves are integer values from 0 inclusive to 8 inclusive`,
  invalidPosition: position,
});

export const missingGameId = (): MissingGameId => ({
  kind: "MissingGameId",
  message: "Missing required game id",
});

export const gameNotFound = (gameId: string): GameNotFound => ({
  kind: "GameNotFound",
  message: `Game "${gameId}" not found`,
  gameId,
});

const POSITION_PLAYED_ERROR = "PositionPlayedError";
const GAME_OVER_ERROR = "GameOverError";
const WRONG_TURN_ERROR = "WrongTurnError";

export class PositionPlayedError extends Error {
  constructor(
    public readonly playedByPlayer: CorePlayer,
    public readonly playedPosition: CorePosition
  ) {
    super("Error: Position already played");
    this.name = "PositionPlayedError";
  }
}

export class GameOverError extends Error {
  constructor(public readonly gameId: string) {
    super("Error: Game over");
    this.name = "GameOverError";
  }
}

export class WrongTurnError extends Error {
  constructor(public readonly wrongPlayer: CorePlayer) {
    super("Error: Wrong turn");
    this.name = "WrongTurnError";
  }
}

const isGameOverError = (e: Error): e is GameOverError =>
  e.name === GAME_OVER_ERROR;
const isWrongTurnError = (e: Error): e is WrongTurnError =>
  e.name === WRONG_TURN_ERROR;
const isPositionPlayedError = (e: Error): e is PositionPlayedError =>
  e.name === POSITION_PLAYED_ERROR;

export const extractException = (e: Error): any => {
  if (isPositionPlayedError(e)) {
    const { name, playedByPlayer, playedPosition } = e;
    return { kind: name, playedByPlayer, playedPosition };
  } else if (isGameOverError(e)) {
    const { name, gameId } = e;
    return { kind: name, gameId };
  } else if (isWrongTurnError(e)) {
    const { name, wrongPlayer } = e;
    return { kind: name, wrongPlayer };
  } else {
    return e;
  }
};
