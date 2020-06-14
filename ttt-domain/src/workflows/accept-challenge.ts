import {
  Challenge,
  ChallengeId,
  Create,
  Find,
  Game,
  Opponent,
  Position,
  UniqueIdProducer,
} from "../model";
import { Async, Result } from "../result";
import { InvalidInput } from "../validation";

// prettier-ignore
export type AcceptChallenge
  =  (dependencies: UniqueIdProducer&ChallengeFinder & GameCreator)
  => AcceptChallengeWorkflow

export type AcceptChallengeWorkflow = (
  input: AcceptChallengeInput
) => Async<AcceptChallengeResult>;

export interface ChallengeFinder {
  readonly findChallenge: Find<ChallengeId, Challenge, ChallengeNotFoundError>;
}

export interface GameCreator {
  readonly createGame: Create<Game, GameCreationFailedError>;
}

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
