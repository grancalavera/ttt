import {
  AsyncResult,
  Failure,
  failure,
  NonEmptyArray,
  Result,
} from "@grancalavera/ttt-etc";
import {
  CountActiveMatches,
  GameSettings,
  GetUniqueId,
  UpsertMatch,
} from "../dependencies";
import { Match, Move, Player } from "../domain/model";
import { WorkflowError } from "./workflow-error";

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

export type CreateMatchInput = Player;

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
  readonly match: Match;
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
  readonly match: Match;
  readonly opponent: Player;
}

export type CreateGameWorkflow = CreateWorkflow<CreateGameDependencies, CreateGameInput>;

// ----------------------------------------------------------------------------
//
// support
//
// ----------------------------------------------------------------------------

export type CreateWorkflow<TDeps, TInput> = (dependencies: TDeps) => RunWorkflow<TInput>;
export type RunWorkflow<T> = (input: T) => WorkflowResult;
export type WorkflowResult = AsyncResult<Match, WorkflowError[]>;

export const arePlayersTheSame = (l: Player, r: Player) => l.id === r.id;

export const workflowFailure = (
  ...failures: NonEmptyArray<Failure<WorkflowError>>
): Result<Match, WorkflowError[]> => failure(failures.map(({ error }) => error));

export const hasErrorKind = (errors: WorkflowError[]) => (
  ...kinds: NonEmptyArray<WorkflowError["kind"]>
) => errors.some((e) => kinds.includes(e.kind));
