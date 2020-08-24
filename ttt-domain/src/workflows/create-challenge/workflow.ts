import { Match } from "../../domain/model";
import { AsyncWorkflowResult, FindMatch, MoveInput, UpsertMatch } from "../support";

export type CreateChallengeWorkflow = (
  dependencies: FindMatch & UpsertMatch
) => CreateChallenge;

export type CreateChallenge = (input: MoveInput) => AsyncWorkflowResult<Match>;

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
