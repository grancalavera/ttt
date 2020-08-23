import { Match, Player, SystemConfig } from "../../domain/model";
import { UpsertMatch, WorkflowResult } from "../support";

export type AcceptChallenge = (
  dependencies: SystemConfig & UpsertMatch
) => AcceptChallengeWorkflow;

export type AcceptChallengeWorkflow = (input: Player) => WorkflowResult<Match>;

export interface AcceptChallengeError {
  readonly kind: "AcceptChallengeError";
  readonly input: Player;
}

export const acceptChallengeError = (input: Player): AcceptChallengeError => ({
  kind: "AcceptChallengeError",
  input,
});

declare module "../errors" {
  export interface WorkflowErrorMap {
    AcceptChallengeError: AcceptChallengeError;
  }
}
