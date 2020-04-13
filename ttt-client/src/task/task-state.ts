export type Task<TData, TError> =
  | IdleTask
  | LoadingTask
  | FailedTask<TError>
  | SuccessfulTask<TData>;

export const IDLE_TASK = "IDLE_TASK";
export const LOADING_TASK = "LOADING_TASK";
export const FAILED_TASK = "FAILED_TASK";
export const SUCCESSFUL_TASK = "SUCCESSFUL_TASK";

interface IdleTask {
  kind: typeof IDLE_TASK;
}

interface LoadingTask {
  kind: typeof LOADING_TASK;
}

interface FailedTask<TError> {
  kind: typeof FAILED_TASK;
  error: TError;
}

interface SuccessfulTask<TData> {
  kind: typeof SUCCESSFUL_TASK;
  data: TData;
}

export const isIdle = (a: Task<any, any>): a is IdleTask => a.kind === IDLE_TASK;

export const isLoading = (a: Task<any, any>): a is LoadingTask => a.kind === LOADING_TASK;

export const didFail = (a: Task<any, any>): a is FailedTask<any> =>
  a.kind === FAILED_TASK;

export const didSucceed = (a: Task<any, any>): a is SuccessfulTask<any> =>
  a.kind === SUCCESSFUL_TASK;

export const idle = (): IdleTask => ({ kind: IDLE_TASK });

export const load = (): LoadingTask => ({ kind: LOADING_TASK });

export const fail = <TError>(error: TError): FailedTask<TError> => ({
  kind: FAILED_TASK,
  error
});

export const succeed = <TData>(data: TData): SuccessfulTask<TData> => ({
  kind: SUCCESSFUL_TASK,
  data
});
