import { Match, SystemConfig } from "../../domain/model";
import { FindMatch, MoveInput, UpsertMatch, WorkflowResult } from "../support";

export type CreateGameCreateGameWorkflow = (
  dependencies: SystemConfig & FindMatch & UpsertMatch
) => CreateGame;

export type CreateGame = (input: MoveInput) => WorkflowResult<Match>;

export class CreateGameError {
  readonly kind = "CreateGameError";
  constructor(readonly input: MoveInput) {}
}

declare module "../errors" {
  export interface WorkflowErrorMap {
    CreateGameError: CreateGameError;
  }
}
