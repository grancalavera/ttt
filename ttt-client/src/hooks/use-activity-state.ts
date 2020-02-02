import { useMemo } from "react";
import { ActivityResult, activityState } from "../common/activity-state";

export const useActivityState = <T>(activityResult: ActivityResult<T>) =>
  useMemo(() => activityState(activityResult), [activityResult]);
