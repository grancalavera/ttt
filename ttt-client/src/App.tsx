import "@blueprintjs/core/lib/css/blueprint.css";
import React, { useEffect, useState } from "react";
import { setAccessToken } from "./access-token";
import { useWhoamiQuery } from "./generated/graphql";

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:4000/refresh_token", {
        method: "POST",
        credentials: "include"
      });
      const { accessToken } = await response.json();
      setAccessToken(accessToken);
      if (response.status !== 200) {
        console.error("failed to refresh token!");
      }
      setLoading(false);
    })();
  }, []);

  return loading ? <>Loading...</> : <Whoami />;
};

const Whoami: React.FC = () => {
  const { data, loading, error } = useWhoamiQuery({ fetchPolicy: "network-only" });
  if (error) return <>Not Authorized</>;
  if (loading) return <>Loading...</>;
  if (data) return <>{data.whoami}</>;
  throw new Error("undefined query state");
};
