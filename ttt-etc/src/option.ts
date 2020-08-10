export type Option<T> = Some<T> | None;

export interface Some<T> {
  readonly kind: "Some";
  readonly value: T;
}

export interface None {
  readonly kind: "None";
}

export const some = <T>(value: T): Option<T> => ({ kind: "Some", value });
export const none: Option<never> = { kind: "None" };
export const isSome = <T>(candidate: Option<T>): candidate is Some<T> =>
  candidate.kind === "Some";

export const isNone = <T>(candidate: Option<T>): candidate is None =>
  candidate.kind === "None";
