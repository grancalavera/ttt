import { Match, Player, SystemConfig } from "../../domain/model";
import {
  AsyncWorkflowResult,
  CountActiveMatches,
  GetUniqueId,
  UpsertMatch,
} from "../support";

export type CreateMatchWorkflow = (dependencies: CreateMatchDependencies) => CreateMatch;

export type CreateMatch = (input: Player) => AsyncWorkflowResult<Match>;

// prettier-ignore
export type CreateMatchDependencies =
  & SystemConfig
  & CountActiveMatches
  & GetUniqueId
  & UpsertMatch;

export class TooManyActiveMatchesError {
  readonly kind = "TooManyActiveMatchesError";

  get message(): string {
    return `player ${this.input.id} already reached the max count of ${this.maxActiveGames} active matches`;
  }

  constructor(readonly input: Player, readonly maxActiveGames: number) {}
}

declare module "../errors" {
  export interface WorkflowErrorMap {
    TooManyActiveMatchesError: TooManyActiveMatchesError;
  }
}
