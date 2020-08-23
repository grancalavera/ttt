import { Match, SystemConfig } from "../../domain/model";
import { FindMatch, MoveInput, UpsertMatch, WorkflowResult } from "../support";

export type CreateChallenge = (
  dependencies: SystemConfig & FindMatch & UpsertMatch
) => CreateChallengeWorkflow;

export type CreateChallengeWorkflow = (input: MoveInput) => WorkflowResult<Match>;

export interface CreateChallengeError {
  readonly kind: "CreateChallengeError";
  readonly input: MoveInput;
}

export const createChallengeError = (input: MoveInput): CreateChallengeError => ({
  kind: "CreateChallengeError",
  input,
});

declare module "../errors" {
  export interface WorkflowErrorMap {
    CreateChallengeError: CreateChallengeError;
  }
}
