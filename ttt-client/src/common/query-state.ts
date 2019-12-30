import { QueryResult, ApolloError } from "@apollo/client";

export type QueryState<TData, TVariables> =
  | QueryIdle<TData, TVariables>
  | QueryLoading<TData, TVariables>
  | QueryFailed<TData, TVariables>
  | QuerySuccess<TData, TVariables>;

export const queryState = <TData, TVariables>(
  queryResult: QueryResult<TData, TVariables>
): QueryState<TData, TVariables> => {
  const { called, data, loading, error, ...rest } = queryResult;

  if (error) {
    return { kind: "QueryFailed", error, ...rest };
  }

  if (!called && !loading) {
    return { kind: "QueryIdle", ...rest };
  }

  if (loading && !data && !error) {
    return { kind: "QueryLoading", ...rest };
  }

  if (!loading && !error && data) {
    return { kind: "QuerySuccess", data, ...rest };
  }

  throw new Error("Unknown query state");
};

interface QueryIdle<TData, TVariables> extends AnyQueryState<TData, TVariables> {
  kind: "QueryIdle";
}

interface QueryLoading<TData, TVariables> extends AnyQueryState<TData, TVariables> {
  kind: "QueryLoading";
}

interface QueryFailed<TData, TVariables> extends AnyQueryState<TData, TVariables> {
  kind: "QueryFailed";
  error: ApolloError;
}

interface QuerySuccess<TData, TVariables> extends AnyQueryState<TData, TVariables> {
  kind: "QuerySuccess";
  data: TData;
}

type AnyQueryState<TData, TVariables> = Omit<
  QueryResult<TData, TVariables>,
  "called" | "data" | "loading" | "error"
>;
