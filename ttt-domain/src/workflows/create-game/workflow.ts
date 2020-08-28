import { GameSettings, MatchId, Player } from "../../domain/model";
import { CountActiveMatches, FindMatch, UpsertMatch, WorkflowResult } from "../support";

export type CreateGameWorkflow = (
  dependencies: GameSettings & FindMatch & UpsertMatch & CountActiveMatches
) => CreateGame;

export type CreateGame = (input: CreateGameInput) => WorkflowResult;
export type CreateGameInput = { matchId: MatchId; opponent: Player };

export class IllegalGameOpponentError {
  readonly kind = "IllegalGameOpponentError";
  get message(): string {
    return `${this.opponent.id} cannot be both the owner and opponent on match ${this.matchId}`;
  }
  constructor(readonly matchId: MatchId, readonly opponent: Player) {}
}

declare module "../workflow-error" {
  export interface WorkflowErrorMap {
    IllegalGameOpponentError: IllegalGameOpponentError;
  }
}
