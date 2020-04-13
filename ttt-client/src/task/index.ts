export {
  SUCCESSFUL_TASK,
  FAILED_TASK,
  IDLE_TASK,
  LOADING_TASK,
  isIdle,
  isLoading,
  didFail,
  didSucceed
} from "task/task-state";

export { useApolloTask } from "task/use-apollo-task";
