import { Result } from "@grancalavera/ttt-etc";
import { Match } from "../../domain/model";
import { WorkflowError } from "../errors";
import { FindMatch, MoveInput, UpsertMatch } from "../support";

export type CreateChallengeWorkflow = (
  dependencies: FindMatch & UpsertMatch
) => CreateChallenge;

export type CreateChallenge = (
  input: MoveInput
) => Promise<Result<Match, WorkflowError[]>>;

export class IllegalMatchOwnerError {
  readonly kind = "IllegalMatchOwnerError";
  get message(): string {
    const [player] = this.input.move;
    return `illegal owner ${player.id} for match ${this.input.matchId}`;
  }
  constructor(readonly input: MoveInput) {}
}

declare module "../errors" {
  export interface WorkflowErrorMap {
    IllegalMatchOwnerError: IllegalMatchOwnerError;
  }
}
