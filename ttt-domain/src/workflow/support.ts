import {
  AsyncResult,
  Failure,
  failure,
  NonEmptyArray,
  Result,
} from "@grancalavera/ttt-etc";
import { Match, Player } from "../domain/model";
import { WorkflowError } from "./workflow-error";

export type CreateWorkflow<TDeps, TInput> = (dependencies: TDeps) => RunWorkflow<TInput>;
export type RunWorkflow<T> = (input: T) => AsyncResult<Match, WorkflowError[]>;

export const arePlayersTheSame = (l: Player, r: Player) => l.id === r.id;

export const workflowFailure = (
  ...failures: NonEmptyArray<Failure<WorkflowError>>
): Result<Match, WorkflowError[]> => failure(failures.map(({ error }) => error));

export const hasErrorKind = (errors: WorkflowError[]) => (
  ...kinds: NonEmptyArray<WorkflowError["kind"]>
) => errors.some((e) => kinds.includes(e.kind));
