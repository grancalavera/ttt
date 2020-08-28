import { Player, MatchId } from "../../domain/model";
import { FindMatch, MoveInput, UpsertMatch, WorkflowResult } from "../support";

export type CreateChallengeWorkflow = (
  dependencies: FindMatch & UpsertMatch
) => CreateChallenge;

export type CreateChallenge = (input: MoveInput) => WorkflowResult;

export class IllegalMatchOwnerError {
  readonly kind = "IllegalMatchOwnerError";
  get message(): string {
    return `illegal owner ${this.player.id} for match ${this.matchId}`;
  }
  constructor(readonly matchId: MatchId, readonly player: Player) {}
}

declare module "../workflow-error" {
  export interface WorkflowErrorMap {
    IllegalMatchOwnerError: IllegalMatchOwnerError;
  }
}
