import { Result } from "./result";

export type AsyncResult<T, E> = Async<Result<T, E>>;
export type Async<T> = () => Promise<T>;
