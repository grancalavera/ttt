import { FindMatch, MoveInput, UpsertMatch, WorkflowResult } from "../support";

export type CreateChallengeWorkflow = (
  dependencies: FindMatch & UpsertMatch
) => CreateChallenge;

export type CreateChallenge = (input: MoveInput) => WorkflowResult;

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
