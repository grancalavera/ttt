import {
  Result,
  AsyncResult,
  NonEmptyArray,
  Failure,
  failure,
} from "@grancalavera/ttt-etc";
import { DomainError } from "./error";

export type DomainResult<T> = Result<T, DomainError[]>;
export type AsyncDomainResult<T> = AsyncResult<T, DomainError[]>;

export const domainFailure = <T>(
  ...failures: NonEmptyArray<Failure<DomainError>>
): Result<T, DomainError[]> => failure(failures.map(({ error }) => error));
