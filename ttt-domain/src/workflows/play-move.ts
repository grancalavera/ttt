import { Game, GameId, Player, Position } from "../model";
import { Async, Result } from "../result";
import { InvalidInput } from "../validation";
import { Find, Update } from "./workflow-support";

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
