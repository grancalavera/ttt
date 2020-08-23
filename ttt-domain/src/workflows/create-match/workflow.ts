import { Match, Player, SystemConfig } from "../../domain/model";
import { GetUniqueId, UpsertMatch, WorkflowResult } from "../support";

export type CreateMatch = (
  dependencies: SystemConfig & GetUniqueId & UpsertMatch
) => CreateMatchWorkflow;

export type CreateMatchWorkflow = (input: Player) => WorkflowResult<Match>;

export interface CreateMatchError {
  readonly kind: "CreateMatchError";
  readonly input: Player;
}

export const createMatchError = (input: Player): CreateMatchError => ({
  kind: "CreateMatchError",
  input,
});

declare module "../errors" {
  export interface WorkflowErrorMap {
    CreateMatchError: CreateMatchError;
  }
}
