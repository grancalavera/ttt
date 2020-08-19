import React from "react";
import { useWhoamiQuery } from "../generated/graphql";
import { Layer } from "../layout/layout";

export const WhoAmI: React.FC = () => {
  const result = useWhoamiQuery({
    fetchPolicy: "network-only",
  });

  const { data, loading, error } = result;

  return (
    <Layer>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : loading ? (
        "Loading..."
      ) : error ? (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      ) : (
        "something went wrong"
      )}
    </Layer>
  );
};
