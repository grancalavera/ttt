import { ApolloError } from "@apollo/client";
import { useMemo } from "react";
import * as task from "task/task-state";
import { Task } from "./task-state";

interface ApolloResult<TData extends unknown> {
  data?: TData;
  error?: ApolloError;
  loading: boolean;
  called: boolean;
}

export const useApolloTask = <TData>(result: ApolloResult<TData>) =>
  useMemo<Task<TData, ApolloError>>(() => {
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
  }, [result]);
