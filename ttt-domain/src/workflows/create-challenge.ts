import { Challenge, Challenger, Position } from "../model";
import { Async, Result } from "../result";
import { Create, UniqueIdProducer } from "./workflow-support";

//  prettier-ignore
export type CreateChallenge
  =  (dependencies: UniqueIdProducer & ChallengeCreator)
  => CreateChallengeWorkflow

//  prettier-ignore
export type CreateChallengeWorkflow
  =  (input: CreateChallengeInput)
  => Async<CreateChallengeResult>;

export interface CreateChallengeInput {
  readonly challenger: Challenger;
  readonly challengerPosition: Position;
}

export type CreateChallengeResult = Result<Challenge, ChallengeCreationFailedError>;

export class ChallengeCreationFailedError {
  readonly kind = "ChallengeNotSavedError";
  constructor(readonly challenge: Challenge) {}
}

export interface ChallengeCreator {
  readonly createChallenge: Create<Challenge, ChallengeCreationFailedError>;
}
