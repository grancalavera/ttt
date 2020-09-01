import { AsyncResult } from "@grancalavera/ttt-etc";
import { DomainError } from "../domain/error";
import { Challenge, Game, Match, MatchDescription, Move, Player } from "../domain/model";
import { GameSettings } from "../system/support";
import { DomainResult, AsyncDomainResult } from "../domain/result";

// ----------------------------------------------------------------------------
//
// inputs
//
// ----------------------------------------------------------------------------

export type WorkflowInput =
  | { kind: "CreateMatch"; input: CreateMatchInput }
  | { kind: "CreateChallenge"; input: CreateChallengeInput }
  | { kind: "CreateGame"; input: CreateGameInput }
  | { kind: "PlayMove"; input: PlayMoveInput };

// ----------------------------------------------------------------------------
//
// create match
//
// ----------------------------------------------------------------------------

export type CreateMatchDependencies = GameSettings & GetUniqueId & UpsertMatch;

export interface CreateMatchInput {
  owner: Player;
}

export type CreateMatchWorkflow = CreateWorkflow<
  CreateMatchDependencies,
  CreateMatchInput
>;

// ----------------------------------------------------------------------------
//
// create challenge
//
// ----------------------------------------------------------------------------

export type CreateChallengeDeps = GameSettings & UpsertMatch;

export interface CreateChallengeInput {
  readonly matchDescription: MatchDescription;
  readonly move: Move;
}

export type CreateChallengeWorkflow = CreateWorkflow<
  CreateChallengeDeps,
  CreateChallengeInput
>;

// ----------------------------------------------------------------------------
//
// create game
//
// ----------------------------------------------------------------------------

export type CreateGameDependencies = GameSettings & UpsertMatch;

export interface CreateGameInput {
  readonly matchDescription: MatchDescription;
  readonly challenge: Challenge;
  readonly opponent: Player;
}

export type CreateGameWorkflow = CreateWorkflow<CreateGameDependencies, CreateGameInput>;

// ----------------------------------------------------------------------------
//
// play move
//
// ----------------------------------------------------------------------------

// prettier-ignore
export type PlayMoveDependencies =
  & GameSettings
  & UpsertMatch;

export interface PlayMoveInput {
  readonly matchDescription: MatchDescription;
  readonly game: Game;
  readonly move: Move;
}

export type PlayMoveWorkflow = CreateWorkflow<PlayMoveDependencies, PlayMoveInput>;

// ----------------------------------------------------------------------------
//
// dependencies
//
// ----------------------------------------------------------------------------

export interface UpsertMatch {
  readonly upsertMatch: (match: Match) => AsyncResult<void, DomainError>;
}

export interface GetUniqueId {
  readonly getUniqueId: () => string;
}

// ----------------------------------------------------------------------------
//
// support
//
// ----------------------------------------------------------------------------

export type WorkflowResult = AsyncDomainResult<Match>;
export type CreateWorkflow<TDeps, TInput> = (dependencies: TDeps) => RunWorkflow<TInput>;
export type RunWorkflow<T> = (input: T) => WorkflowResult;

export const arePlayersTheSame = (l: Player, r: Player) => l.id === r.id;
