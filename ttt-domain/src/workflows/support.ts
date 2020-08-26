import { Result, Failure, NonEmptyArray, sequence, failure } from "@grancalavera/ttt-etc";
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

type Find<TRef, T> = (ref: TRef) => Promise<Result<T, WorkflowError>>;
type Upsert<T> = (data: T) => Promise<Result<void, WorkflowError>>;

export type FindMatch = { findMatch: Find<MatchId, Match> };
export type UpsertMatch = { upsertMatch: Upsert<Match> };
export type CountActiveMatches = {
  countActiveMatches: (player: Player) => Promise<number>;
};

export type StandardDependencies = SystemConfig & FindMatch & UpsertMatch;

export class TooManyActiveMatchesError {
  readonly kind = "TooManyActiveMatchesError";
  get message(): string {
    return `player ${this.input.id} already reached the max count of ${this.maxActiveMatches} active matches`;
  }
  constructor(readonly input: Player, readonly maxActiveMatches: number) {}
}

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

export class IllegalMoveError {
  readonly kind = "IllegalMoveError";
  get message(): string {
    return `position ${this.input.move[1]} already played on match ${this.input.matchId}`;
  }
  constructor(readonly input: MoveInput) {}
}

export const arePlayersTheSame = (l: Player, r: Player) => l.id === r.id;

export const workflowFailure = (
  ...failures: NonEmptyArray<Failure<WorkflowError>>
): Result<Match, WorkflowError[]> => failure(failures.map(({ error }) => error));

declare module "./errors" {
  export interface WorkflowErrorMap {
    IllegalMatchStateError: IllegalMatchStateError;
    IllegalMoveError: IllegalMoveError;
    MatchNotFoundError: MatchNotFoundError;
    TooManyActiveMatchesError: TooManyActiveMatchesError;
    UpsertFailedError: UpsertFailedError;
  }
}
