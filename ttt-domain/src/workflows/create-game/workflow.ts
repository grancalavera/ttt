import { Result } from "@grancalavera/ttt-etc";
import { Match, SystemConfig } from "../../domain/model";
import { WorkflowError } from "../errors";
import { CountActiveMatches, FindMatch, MoveInput, UpsertMatch } from "../support";

export type CreateGameWorkflow = (
  dependencies: SystemConfig & FindMatch & UpsertMatch & CountActiveMatches
) => CreateGame;

export type CreateGame = (input: MoveInput) => Promise<Result<Match, WorkflowError[]>>;

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
