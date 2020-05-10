import { ApolloError, MutationResult } from "@apollo/client";
import * as task from "task/task-state";
import { Task } from "./task-state";

export const mutationResultToTask = <TData>(
  result: MutationResult<TData>
): Task<TData, ApolloError> => {
  const { called, data, loading, error } = result;

  if (error) {
    return task.fail(error);
  }

  if (!called && !loading) {
    return task.idle();
  }

  if (loading && !data && !error) {
    return task.load();
  }

  if (!loading && !error && data) {
    return task.succeed(data);
  }

  throw new Error("Unknown result state");
};
