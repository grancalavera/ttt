import { Match, SystemConfig } from "../../domain/model";
import { AsyncWorkflowResult, FindMatch, MoveInput, UpsertMatch } from "../support";

export type CreateGameWorkflow = (
  dependencies: SystemConfig & FindMatch & UpsertMatch
) => CreateGame;

export type CreateGame = (input: MoveInput) => AsyncWorkflowResult<Match>;

export class IllegalGameOpponentError {
  readonly kind = "IllegalGameOpponentError";
  get message(): string {
    const [player] = this.input.move;
    return `${player.id} cannot be both the owner and opponent of the same match`;
  }
  constructor(readonly input: MoveInput) {}
}

export class CreateGameError {
  readonly kind = "CreateGameError";
  constructor(readonly input: MoveInput) {}
}

declare module "../errors" {
  export interface WorkflowErrorMap {
    IllegalGameOpponentError: IllegalGameOpponentError;
  }
}
