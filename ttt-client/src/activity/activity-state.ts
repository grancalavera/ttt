import { ApolloError } from "@apollo/client";

export type ActivityState<TData> =
  | ActivityIdle
  | ActivityLoading
  | ActivityFailed
  | ActivitySuccess<TData>;

export interface ActivityResult<TData = any> {
  data?: TData;
  error?: ApolloError;
  loading: boolean;
  called: boolean;
}

export const ACTIVITY_IDLE = "ACTIVITY_IDLE";
export const ACTIVITY_LOADING = "ACTIVITY_LOADING";
export const ACTIVITY_FAILED = "ACTIVITY_FAILED";
export const ACTIVITY_SUCCESS = "ACTIVITY_SUCCESS";

interface ActivityIdle {
  kind: typeof ACTIVITY_IDLE;
}

interface ActivityLoading {
  kind: typeof ACTIVITY_LOADING;
}

interface ActivityFailed {
  kind: typeof ACTIVITY_FAILED;
  error: ApolloError;
}

interface ActivitySuccess<TData> {
  kind: typeof ACTIVITY_SUCCESS;
  data: TData;
}

export const isIdle = (a: ActivityState<any>): a is ActivityIdle =>
  a.kind === ACTIVITY_IDLE;

export const isLoading = (a: ActivityState<any>): a is ActivityLoading =>
  a.kind === ACTIVITY_LOADING;

export const didFail = (a: ActivityState<any>): a is ActivityFailed =>
  a.kind === ACTIVITY_FAILED;

export const didSucceed = (a: ActivityState<any>): a is ActivitySuccess<any> =>
  a.kind === ACTIVITY_SUCCESS;