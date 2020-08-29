import { AsyncResult } from "@grancalavera/ttt-etc";
import { Match, MatchId, Player } from ".";
import { WorkflowError } from "./workflow/workflow-error";

export type FindFirstChallenge = { findFirstChallenge: Find<void, Match> };
export type FindMatch = { findMatch: Find<MatchId, Match> };
export type UpsertMatch = { upsertMatch: Upsert<Match> };

export interface GetUniqueId {
  readonly getUniqueId: () => string;
}

export type CountActiveMatches = {
  countActiveMatches: (player: Player) => Promise<number>;
};

export interface GameSettings {
  readonly gameSize: number;
  readonly maxActiveMatches: number;
}

type Find<TRef, T> = (ref: TRef) => AsyncResult<T, WorkflowError>;
type Upsert<T> = (data: T) => AsyncResult<void, WorkflowError>;
