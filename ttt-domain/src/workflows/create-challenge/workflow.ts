import { FindMatch, MoveInput, UpsertMatch, WorkflowResult } from "../support";

export type CreateChallengeWorkflow = (
  dependencies: FindMatch & UpsertMatch
) => CreateChallenge;

export type CreateChallenge = (input: MoveInput) => WorkflowResult;
