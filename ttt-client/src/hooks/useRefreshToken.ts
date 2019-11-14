import { useEffect, useState } from "react";
import { setAccessToken } from "../access-token";

export const useRefreshToken = () => {
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
  return loading;
};
