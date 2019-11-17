import { useEffect, useState } from "react";
import { setAccessToken } from "../access-token";

export type AuthStatus = "loading" | "authorized" | "unauthorized";

export const useRefreshToken = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
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
        setAuthStatus("unauthorized");
      } else {
        setAuthStatus("authorized");
      }
    })();
  }, []);
  return authStatus;
};
