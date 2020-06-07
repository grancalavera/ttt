import { Result, failure, success, isFailure, isSuccess } from "result";

// prettier-ignore
export function sequence<E, T1, T2, T3, T4, T5>(results: [Result<T1, E>, Result<T2, E>, Result<T3, E>, Result<T4, E>, Result<T5, E>]): Result<[T1, T2, T3, T4, T5], E[]>;
// prettier-ignore
export function sequence<E, T1, T2, T3, T4>(results: [Result<T1, E>, Result<T2, E>, Result<T3,E>, Result<T4,E>]): Result<[T1, T2, T3, T4], E[]>;
// prettier-ignore
export function sequence<E, T1, T2, T3>(results: [Result<T1, E>, Result<T2, E>, Result<T3,E>]): Result<[T1, T2, T3], E[]>;
// prettier-ignore
export function sequence<E, T1, T2>(results: [Result<T1, E>, Result<T2, E>]): Result<[T1, T2], E[]>;
// prettier-ignore
export function sequence<E, T1>(results: [Result<T1, E>]): Result<[T1], E[]>;

export function sequence(results: NonEmptyArray<Result<any, any>>): Result<any[], any[]> {
  return results.reduce((resultOfList, result) => {
    if (isFailure(resultOfList) && isFailure(result)) {
      return failure([...resultOfList.error, result.error]);
    } else if (isFailure(resultOfList) && isSuccess(result)) {
      return resultOfList;
    } else if (isSuccess(resultOfList) && isFailure(result)) {
      return failure([result.error]);
    } else if (isSuccess(resultOfList) && isSuccess(result)) {
      return success([...resultOfList.value, result.value]);
    }
    throw new Error("validation.sequence impossible condition");
  }, success([]));
}

type NonEmptyArray<T> = [T, ...T[]];
