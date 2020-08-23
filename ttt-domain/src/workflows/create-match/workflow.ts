import { Match, Player, SystemConfig } from "../../domain/model";
import { GetUniqueId, UpsertMatch, WorkflowResult } from "../support";

export type CreateMatchWorkflow = (
  dependencies: SystemConfig & GetUniqueId & UpsertMatch
) => CreateMatch;

export type CreateMatch = (input: Player) => WorkflowResult<Match>;

export class CreateMatchError {
  readonly kind = "CreateMatchError";
  constructor(readonly input: Player) {}
}

declare module "../errors" {
  export interface WorkflowErrorMap {
    CreateMatchError: CreateMatchError;
  }
}
