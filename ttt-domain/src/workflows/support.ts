import { Result } from "@grancalavera/ttt-etc";
import {
  Match,
  MatchId,
  Move,
  Player,
  SystemConfig,
  MatchStateName,
} from "../domain/model";
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

export type StandardDependencies = SystemConfig & FindMatch & UpsertMatch;

export class MatchNotFoundError {
  readonly kind = "MatchNotFoundError";
  get message(): string {
    return `match ${this.matchId} not found`;
  }
  constructor(readonly matchId: MatchId) {}
}

export class UpsertFailedError {
  readonly kind = "UpsertFailedError";
  constructor(readonly match: Match, readonly reason: any) {}
}

export class IllegalMatchStateError {
  readonly kind = "IllegalMatchStateError";
  get message(): string {
    return `match ${this.input.matchId} is on an illegal state: wanted state ${this.wantedState}, actual state ${this.actualState}`;
  }
  constructor(
    readonly input: MoveInput,
    readonly wantedState: MatchStateName,
    readonly actualState: MatchStateName
  ) {}
}

export const arePlayersTheSame = (l: Player, r: Player) => l.id === r.id;

declare module "./errors" {
  export interface WorkflowErrorMap {
    MatchNotFoundError: MatchNotFoundError;
    UpsertFailedError: UpsertFailedError;
    IllegalMatchStateError: IllegalMatchStateError;
  }
}
