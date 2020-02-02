import { useMemo } from "react";
import {
  ActivityResult,
  ActivityState,
  ACTIVITY_FAILED,
  ACTIVITY_IDLE,
  ACTIVITY_LOADING,
  ACTIVITY_SUCCESS,
} from "../common/activity-state";

export const useActivityState = <T>(activityResult: ActivityResult<T>) =>
  useMemo(() => activityState(activityResult), [activityResult]);

const activityState = <TData>(
  activityResult: ActivityResult<TData>
): ActivityState<TData> => {
  const { called, data, loading, error } = activityResult;

  if (error) {
    return { kind: ACTIVITY_FAILED, error };
  }

  if (!called && !loading) {
    return { kind: ACTIVITY_IDLE };
  }

  if (loading && !data && !error) {
    return { kind: ACTIVITY_LOADING };
  }

  if (!loading && !error && data) {
    return { kind: ACTIVITY_SUCCESS, data };
  }

  throw new Error("Unknown query state");
};
