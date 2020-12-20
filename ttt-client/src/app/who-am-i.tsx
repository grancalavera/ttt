import React from "react";
import { client } from "@grancalavera/ttt-schema"
import { Screen } from "../layout/layout";

export const WhoAmI: React.FC = () => {
  const result = client.useWhoamiQuery({
    fetchPolicy: "network-only",
  });

  const { data, loading, error } = result;

  return (
    <Screen>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : loading ? (
        "Loading..."
      ) : error ? (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      ) : (
        "something went wrong"
      )}
    </Screen>
  );
};
