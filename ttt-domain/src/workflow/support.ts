import { AsyncResult } from "@grancalavera/ttt-etc";
import { DomainError } from "../domain/error";
import { Challenge, Game, Match, MatchDescription, Move, Player } from "../domain/model";
import { GameSettings } from "../system/support";

// inputs

export type WorkflowInput =
  | { kind: "CreateMatch"; input: CreateMatchInput }
  | { kind: "CreateChallenge"; input: CreateChallengeInput }
  | { kind: "CreateGame"; input: CreateGameInput }
  | { kind: "PlayMove"; input: CreateMoveInput };

export class CreateMatch {
  readonly kind = "CreateMatch";
  constructor(readonly input: CreateMatchInput) {}
}

export class CreateChallenge {
  readonly kind = "CreateChallenge";
  constructor(readonly input: CreateChallengeInput) {}
}

export class CreateGame {
  readonly kind = "CreateGame";
  constructor(readonly input: CreateGameInput) {}
}

export class PlayMove {
  readonly kind = "PlayMove";
  constructor(readonly input: CreateMoveInput) {}
}

// create match

export interface CreateMatchInput {
  owner: Player;
}

export type CreateMatchWorkflow = CreateWorkflow<
  GameSettings & GetUniqueId & UpsertMatch,
  CreateMatchInput
>;

// create challenge

export interface CreateChallengeInput {
  readonly matchDescription: MatchDescription;
  readonly move: Move;
}

export type CreateChallengeWorkflow = CreateWorkflow<
  GameSettings & UpsertMatch,
  CreateChallengeInput
>;

// create game

export interface CreateGameInput {
  readonly matchDescription: MatchDescription;
  readonly challenge: Challenge;
  readonly opponent: Player;
}

export type CreateGameWorkflow = CreateWorkflow<
  GameSettings & UpsertMatch,
  CreateGameInput
>;

// create move

export interface CreateMoveInput {
  readonly matchDescription: MatchDescription;
  readonly game: Game;
  readonly move: Move;
}

export type CreateMoveWorkflow = CreateWorkflow<
  GameSettings & UpsertMatch,
  CreateMoveInput
>;

// dependencies

export interface UpsertMatch {
  readonly upsertMatch: (match: Match) => AsyncResult<void, DomainError>;
}

export interface GetUniqueId {
  readonly getUniqueId: () => string;
}

// support

export type RunWorkflow<T> = (input: T) => WorkflowResult;

type WorkflowResult = AsyncResult<Match, DomainError[]>;
type CreateWorkflow<TDeps, TInput> = (dependencies: TDeps) => RunWorkflow<TInput>;
