export type Result<T, E> = Success<T> | Failure<E>;

export type Success<T> = { kind: "Success"; value: T };
export type Failure<E> = { kind: "Failure"; error: E };

export const success = <T>(value: T): Result<T, never> => ({ kind: "Success", value });
export const failure = <E>(error: E): Result<never, E> => ({ kind: "Failure", error });

export const isSuccess = <T, E>(r: Result<T, E>): r is Success<T> => r.kind === "Success";
export const isFailure = <T, E>(r: Result<T, E>): r is Failure<E> => r.kind === "Failure";

export const getSuccess = <T>({ value }: Success<T>): T => value;
export const getFailure = <E>({ error }: Failure<E>): E => error;
