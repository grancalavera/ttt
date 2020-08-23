import { Result } from "@grancalavera/ttt-etc";
import { Match, MatchId, Move, Player } from "../domain/model";
import { WorkflowError } from "./errors";

export interface GetUniqueId {
  readonly getUniqueId: () => string;
}

export interface MoveInput {
  matchId: MatchId;
  move: Move;
}

type Find<TRef, T> = (ref: TRef) => AsyncWorkflowResult<T>;
type Upsert<T> = (data: T) => AsyncWorkflowResult<void>;

export type WorkflowResult<T> = Result<T, WorkflowError>;
export type AsyncWorkflowResult<T> = Promise<WorkflowResult<T>>;

export type FindMatch = { findMatch: Find<MatchId, Match> };
export type UpsertMatch = { upsertMatch: Upsert<Match> };
export type CountActiveMatches = {
  countActiveMatches: (player: Player) => Promise<number>;
};

export class FindMatchError {
  readonly kind = "FindMatchError";
  constructor(readonly matchId: MatchId, readonly message: string) {}
}

export class UpsertMatchError {
  readonly kind = "UpsertMatchError";
  constructor(readonly match: Match, readonly message: string) {}
}

export class UnknownError {
  readonly kind = "UnknownError";
  constructor(readonly message: string) {}
}

export const arePlayersTheSame = (l: Player, r: Player) => l.id === r.id;

declare module "./errors" {
  export interface WorkflowErrorMap {
    FindMatchError: FindMatchError;
    UpsertMatchError: UpsertMatchError;
    UnknownError: UnknownError;
  }
}
