import { AsyncResult } from "@grancalavera/ttt-etc";
import { Match, MatchId, Move, Player } from "../domain/model";
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

export class FindMatchError {
  readonly kind = "FindMatchError";
  constructor(readonly matchId: MatchId, readonly message: string) {}
}

export class UpsertMatchError {
  readonly kind = "UpsertMatchError";
  constructor(readonly match: Match, readonly message: string) {}
}

export const arePlayersTheSame = (l: Player, r: Player) => l.id === r.id;

declare module "./errors" {
  export interface WorkflowErrorMap {
    FindMatchError: FindMatchError;
    UpsertMatchError: UpsertMatchError;
  }
}
