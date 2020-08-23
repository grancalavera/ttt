import { Match, SystemConfig } from "../../domain/model";
import { FindMatch, MoveInput, UpsertMatch, WorkflowResult } from "../support";

export type CreateGame = (
  dependencies: SystemConfig & FindMatch & UpsertMatch
) => CreateGameWorkflow;

export type CreateGameWorkflow = (input: MoveInput) => WorkflowResult<Match>;

export interface CreateGameError {
  readonly kind: "CreateGameError";
  readonly input: MoveInput;
}

export const createGameError = (input: MoveInput): CreateGameError => ({
  kind: "CreateGameError",
  input,
});

declare module "../errors" {
  export interface WorkflowErrorMap {
    CreateGameError: CreateGameError;
  }
}
