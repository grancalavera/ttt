import { Match, Player, SystemConfig } from "../../domain/model";
import { UpsertMatch, WorkflowResult, FindMatch } from "../support";

export type AcceptChallengeWorkflow = (
  dependencies: SystemConfig & FindMatch & UpsertMatch
) => AcceptChallenge;

export type AcceptChallenge = (input: Player) => WorkflowResult<Match>;

export class AcceptChallengeError {
  readonly kind = "AcceptChallengeError";
  constructor(readonly input: Player) {}
}

declare module "../errors" {
  export interface WorkflowErrorMap {
    AcceptChallengeError: AcceptChallengeError;
  }
}
