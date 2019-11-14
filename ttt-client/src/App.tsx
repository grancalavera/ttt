import "@blueprintjs/core/lib/css/blueprint.css";
import React from "react";
import { useWhoamiQuery, usePingQuery } from "./generated/graphql";
import { useRefreshToken } from "./hooks/useRefreshToken";

export const App: React.FC = () => {
  const loading = useRefreshToken();
  return (
    <div>
      <Ping />
      {loading ? <div>Loading...</div> : <Whoami />}
    </div>
  );
};

const Whoami: React.FC = () => {
  const { data, loading, error } = useWhoamiQuery({
    fetchPolicy: "network-only"
  });
  if (error) throw error;
  if (loading) return <div>Loading...</div>;
  if (data) return <div>{data.whoami}</div>;
  throw new Error("undefined query state");
};

const Ping: React.FC = () => {
  const { data, loading, error } = usePingQuery({
    fetchPolicy: "network-only"
  });

  if (error) throw error;
  if (loading) return <div>Loading...</div>;
  if (data) return <div>{data.ping}</div>;
  throw new Error("undefined query state");
};
