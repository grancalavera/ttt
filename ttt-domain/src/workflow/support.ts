import { AsyncResult } from "@grancalavera/ttt-etc";
import {
  CountActiveMatches,
  GameSettings,
  GetUniqueId,
  UpsertMatch,
} from "../dependencies";
import { DomainError } from "../domain/error";
import { Challenge, Game, Match, MatchDescription, Move, Player } from "../domain/model";

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

// prettier-ignore
export type CreateMatchDependencies =
  & GameSettings
  & CountActiveMatches
  & GetUniqueId
  & UpsertMatch;

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

// prettier-ignore
export type CreateChallengeDeps =
  & GameSettings
  & CountActiveMatches
  & UpsertMatch;

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

// prettier-ignore
export type CreateGameDependencies =
  & GameSettings
  & CountActiveMatches
  & UpsertMatch;

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
  & CountActiveMatches
  & UpsertMatch;

export interface PlayMoveInput {
  readonly matchDescription: MatchDescription;
  readonly game: Game;
  readonly move: Move;
}

export type PlayMoveWorkflow = CreateWorkflow<PlayMoveDependencies, PlayMoveInput>;

// ----------------------------------------------------------------------------
//
// support
//
// ----------------------------------------------------------------------------

export type CreateWorkflow<TDeps, TInput> = (dependencies: TDeps) => RunWorkflow<TInput>;
export type RunWorkflow<T> = (input: T) => WorkflowResult;
export type WorkflowResult = AsyncResult<Match, DomainError[]>;

export const arePlayersTheSame = (l: Player, r: Player) => l.id === r.id;
