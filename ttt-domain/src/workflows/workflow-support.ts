import { AsyncResult } from "../result";

export interface UniqueIdProducer {
  readonly getUniqueId: () => string;
}

export type Find<TRef, T, E> = (ref: TRef) => AsyncResult<T, E>;
export type Create<T, E> = (data: T) => AsyncResult<void, E>;
export type Update<TRef, T, E> = (ref: TRef, data: T) => AsyncResult<void, E>;
