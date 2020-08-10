import { Async, InvalidInput, Result } from "@grancalavera/ttt-etc";
import { Challenge, ChallengeId, Game, Opponent, Position } from "../model";
import { Create, Find, UniqueIdProducer } from "./workflow-support";

// prettier-ignore
export type AcceptChallenge
  =  (dependencies: UniqueIdProducer & ChallengeFinder & GameCreator)
  => AcceptChallengeWorkflow

// prettier-ignore
export type AcceptChallengeWorkflow
  =  (input: AcceptChallengeInput)
  => Async<AcceptChallengeResult>;

export interface AcceptChallengeInput {
  readonly challengeId: ChallengeId;
  readonly opponent: Opponent;
  readonly opponentPosition: Position;
}

export interface CreateGameInput {
  readonly challenge: Challenge;
  readonly opponent: Opponent;
  readonly opponentPosition: Position;
}

export type AcceptChallengeResult = Result<Game, AcceptChallengeError>;

export type AcceptChallengeError =
  | ChallengeNotFoundError
  | CreateGameValidationError
  | GameCreationFailedError;

export class ChallengeNotFoundError {
  readonly kind = "ChallengeNotFoundError";
  constructor(readonly challengeId: ChallengeId) {}
}

export class CreateGameValidationError {
  readonly kind = "CreateGameValidationError";
  constructor(readonly validationResult: InvalidInput<CreateGameInput>[]) {}
}

export class GameCreationFailedError {
  readonly kind = "GameCreationFailedError";
  constructor(readonly game: Game) {}
}

export interface ChallengeFinder {
  readonly findChallenge: Find<ChallengeId, Challenge, ChallengeNotFoundError>;
}

export interface GameCreator {
  readonly createGame: Create<Game, GameCreationFailedError>;
}
