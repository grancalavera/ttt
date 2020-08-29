import {
  AsyncResult,
  Failure,
  failure,
  NonEmptyArray,
  Result,
} from "@grancalavera/ttt-etc";
import {
  CountActiveMatches,
  FindMatch,
  GameSettings,
  GetUniqueId,
  UpsertMatch,
} from "../dependencies";
import { Match, MatchId, Move, Player } from "../domain/model";
import { WorkflowError } from "./workflow-error";

// ----------------------------------------------------------------------------
//
// create match
//
// ----------------------------------------------------------------------------

export type CreateMatchDependencies = GameSettings &
  CountActiveMatches &
  GetUniqueId &
  UpsertMatch;

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

export type CreateChallengeDeps = FindMatch &
  UpsertMatch &
  CountActiveMatches &
  GameSettings;

export type CreateChallengeInput = { matchId: MatchId; move: Move };

export type CreateChallengeWorkflow = CreateWorkflow<
  CreateChallengeDeps,
  CreateChallengeInput
>;

// ----------------------------------------------------------------------------
//
// create game
//
// ----------------------------------------------------------------------------

export type CreateGameDependencies = GameSettings &
  FindMatch &
  UpsertMatch &
  CountActiveMatches;

export type CreateGameInput = { matchId: MatchId; opponent: Player };

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
