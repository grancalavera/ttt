import { Failure, failure, NonEmptyArray, Result } from "@grancalavera/ttt-etc";
import { DomainError } from "./error";

export const domainFailure = <T>(
  ...failures: NonEmptyArray<Failure<DomainError>>
): Result<T, DomainError[]> => failure(failures.map(({ error }) => error));
