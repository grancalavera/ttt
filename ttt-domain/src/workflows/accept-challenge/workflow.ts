import { Match, Player, SystemConfig, MatchId } from "../../domain/model";
import { UpsertMatch, WorkflowResult, FindMatch } from "../support";

export type AcceptChallengeWorkflow = (
  dependencies: SystemConfig & FindMatch & UpsertMatch
) => AcceptChallenge;

export type AcceptChallenge = (input: AcceptChallengeInput) => WorkflowResult<Match>;

export interface AcceptChallengeInput {
  matchId: MatchId;
  player: Player;
}

export class AcceptChallengeError {
  readonly kind = "AcceptChallengeError";
  constructor(readonly input: AcceptChallengeInput) {}
}

declare module "../errors" {
  export interface WorkflowErrorMap {
    AcceptChallengeError: AcceptChallengeError;
  }
}
