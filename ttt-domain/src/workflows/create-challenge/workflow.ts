import { Match, SystemConfig } from "../../domain/model";
import { FindMatch, MoveInput, UpsertMatch, WorkflowResult } from "../support";

export type CreateChallengeWorkflow = (
  dependencies: SystemConfig & FindMatch & UpsertMatch
) => CreateChallenge;

export type CreateChallenge = (input: MoveInput) => WorkflowResult<Match>;

export class CreateChallengeError {
  readonly kind = "CreateChallengeError";
  constructor(readonly input: MoveInput) {}
}

declare module "../errors" {
  export interface WorkflowErrorMap {
    CreateChallengeError: CreateChallengeError;
  }
}
