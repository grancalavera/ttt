import { Button } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import React from "react";
import { gql, useQuery } from "@apollo/client";

export const App: React.FC = () => {
  const PING = gql`
    query Ping {
      ping
    }
  `;

  const { data, loading } = useQuery(PING, { fetchPolicy: "network-only" });

  return (
    <>
      <Button intent="danger" text="install all the viruses" />
      {loading ? <p>loading...</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  );
};
