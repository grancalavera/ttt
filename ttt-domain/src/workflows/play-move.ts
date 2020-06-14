import { Find, Game, GameId, Player, Position } from "../model";
import { Async, Result } from "../result";
import { InvalidInput } from "../validation";

// prettier-ignore
export type PlayMove
  =  (dependencies: GameFinder)
  => PlayMoveWorkflow

export type PlayMoveWorkflow = (input: PlayMoveInput) => Async<PlayMoveResult>;

export interface GameFinder {
  readonly findGame: Find<GameId, Game, GameNotFoundError>;
}

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
