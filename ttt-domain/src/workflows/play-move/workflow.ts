import { Async, InvalidInput, Result } from "@grancalavera/ttt-etc";
import { Game, GameId, Player, Position } from "../../domain/model";
import { Find, Update } from "../support";

// prettier-ignore
export type PlayMove
  =  (dependencies: GameFinder & GameUpdater)
  => PlayMoveWorkflow

// prettier-ignore
export type PlayMoveWorkflow
  =  (input: PlayMoveInput)
  => Async<PlayMoveResult>;

export interface PlayMoveInput {
  readonly gameId: GameId;
  readonly player: Player;
  readonly playerPosition: Position;
}

export interface CreateMoveInput {
  readonly game: Game;
  readonly player: Player;
  readonly playerPosition: Position;
}

export type PlayMoveResult = Result<Game, PlayMoveError>;

export type PlayMoveError =
  | GameNotFoundError
  | CreateMoveValidationError
  | GameUpdateFailedError;

export class GameNotFoundError {
  readonly kind = "GameNotFoundError";
  constructor(readonly gameId: GameId) {}
}

export class GameUpdateFailedError {
  readonly kind = "GameUpdateFailedError";
  constructor(readonly game: Game) {}
}

export class CreateMoveValidationError {
  readonly kind = "CreateMoveValidationError";
  constructor(readonly validationResult: InvalidInput<CreateMoveInput>[]) {}
}

export interface GameFinder {
  readonly findGame: Find<GameId, Game, GameNotFoundError>;
}

export interface GameUpdater {
  readonly updateGame: Update<GameId, Game, GameUpdateFailedError>;
}
