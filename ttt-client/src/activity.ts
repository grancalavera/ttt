import { useState } from "react";

export enum Activity {
  Idle = "Activity:Idle",
  Failed = "Activity:Failed",
  Complete = "Activity:Complete"
}

export const getActivityState = (isCompleted: any, hasError: any): Activity => {
  if (hasError) {
    return Activity.Failed;
  } else if (isCompleted) {
    return Activity.Complete;
  } else {
    return Activity.Idle;
  }
};

export const useActivityState = <TComplete extends any, TError extends any>(
  initialIsCompleted: TComplete,
  initialHasError: TError
) => {
  const [activityState, setActivityStateInternal] = useState(
    getActivityState(initialIsCompleted, initialHasError)
  );

  const setActivityState = (updateIsCompleted: TComplete, updateHasError: TError) => {
    setActivityStateInternal(getActivityState(updateIsCompleted, updateHasError));
  };

  return [activityState, setActivityState] as const;
};
