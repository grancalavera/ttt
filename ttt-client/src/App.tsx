import "@blueprintjs/core/lib/css/blueprint.css";
import React, { useEffect } from "react";
import { setAccessToken } from "./access-token";
import { Routes } from "./routes";
import { useState } from "react";

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

  return loading ? <>Loading...</> : <Routes />;
};

// const PING = gql`
//   query Ping {
//     ping
//   }
// `;

// const { data, loading } = useQuery(PING, { fetchPolicy: "network-only" });
