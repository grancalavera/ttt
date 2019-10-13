import { CorePlayer, CorePosition } from "@grancalavera/ttt-core";

export interface InvalidRequest {
  name: "InvalidRequest";
  message: string;
}

export interface MissingGameId {
  name: "MissingGameId";
  message: string;
}

export interface GameNotFound {
  name: "GameNotFound";
  message: string;
  gameId: string;
}

export interface ValidationError {
  name: "ValidationError";
  errors: (InvalidPlayer | InvalidPosition)[];
}

export interface InvalidPlayer {
  name: "InvalidPlayer";
  invalidPlayer: any;
  message: string;
}

export interface InvalidPosition {
  name: "InvalidPosition";
  invalidPosition: any;
  message: string;
}

export const validationError = (
  errors: (InvalidPlayer | InvalidPosition)[]
): ValidationError => ({
  name: "ValidationError",
  errors
});

export const invalidPlayer = (player: any): InvalidPlayer => ({
  name: "InvalidPlayer",
  message: `Invalid player "${player}, valid players are "O" and "X" only`,
  invalidPlayer: player
});

export const invalidPosition = (position: any): InvalidPosition => ({
  name: "InvalidPosition",
  message: `Invalid position "${position}", valid moves are integer values from 0 inclusive to 8 inclusive`,
  invalidPosition: position
});

export const missingGameId = (): MissingGameId => ({
  name: "MissingGameId",
  message: "Missing required game id"
});

export const gameNotFound = (gameId: string): GameNotFound => ({
  name: "GameNotFound",
  message: `Game "${gameId}" not found`,
  gameId
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

const isPositionPlayedError = (e: Error): e is PositionPlayedError =>
  e.name === POSITION_PLAYED_ERROR;

const isGameOverError = (e: Error): e is GameOverError => e.name === GAME_OVER_ERROR;

const isWrongTurnError = (e: Error): e is WrongTurnError => e.name === WRONG_TURN_ERROR;

export const extractException = (e: Error): any => {
  if (isPositionPlayedError(e)) {
    const { name, playedByPlayer, playedPosition } = e;
    return { name, playedByPlayer, playedPosition };
  } else if (isGameOverError(e)) {
    const { name, gameId } = e;
    return { name, gameId };
  } else if (isWrongTurnError(e)) {
    const { name, wrongPlayer } = e;
    return { name, wrongPlayer };
  } else {
    throw e;
  }
};
