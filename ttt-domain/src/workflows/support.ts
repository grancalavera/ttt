import { AsyncResult } from "@grancalavera/ttt-etc";
import { Match, MatchId, Player, Move } from "../domain/model";
import { WorkflowError } from "./errors";

export interface GetUniqueId {
  readonly getUniqueId: () => string;
}

export interface MoveInput {
  matchId: MatchId;
  move: Move;
}

type Find<TRef, T> = (ref: TRef) => WorkflowResult<T>;
type Upsert<T> = (data: T) => WorkflowResult<void>;

export type WorkflowResult<T> = AsyncResult<T, WorkflowError>;
export type MatchResult = AsyncResult<Match, WorkflowError>;

export type FindMatch = { findMatch: Find<MatchId, Match> };
export type UpsertMatch = { upsertMatch: Upsert<Match> };

export interface FindMatchError {
  kind: "FindMatchError";
  matchId: MatchId;
  message: string;
}

export interface UpsertMatchError {
  kind: "UpsertMatchError";
  match: Match;
  message: string;
}

export const findMatchError = (matchId: MatchId, message: string): FindMatchError => ({
  kind: "FindMatchError",
  matchId,
  message,
});

export const upsertMatchError = (match: Match, message: string): UpsertMatchError => ({
  kind: "UpsertMatchError",
  match,
  message,
});

export const arePlayersTheSame = (l: Player, r: Player) => l.id === r.id;

declare module "./errors" {
  export interface WorkflowErrorMap {
    FindMatchError: FindMatchError;
    UpsertMatchError: UpsertMatchError;
  }
}
