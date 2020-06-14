import { Game, GameId, Player, Position } from "../model";
import { Async, Result } from "../result";
import { InvalidInput } from "../validation";
import { Find } from "./workflow-support";

// prettier-ignore
export type PlayMove
  =  (dependencies: GameFinder)
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

export type PlayMoveError = GameNotFoundError | CreateMoveValidationError;

export class GameNotFoundError {
  readonly kind = "GameNotFoundError";
  constructor(readonly gameId: GameId) {}
}

export class CreateMoveValidationError {
  readonly kind = "CreateMoveValidationError";
  constructor(readonly validationResult: InvalidInput<CreateMoveInput>[]) {}
}

export interface GameFinder {
  readonly findGame: Find<GameId, Game, GameNotFoundError>;
}
