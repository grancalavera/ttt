import { useEffect, useState } from "react";
import { setAccessToken } from "../access-token";
import { useRegisterMutation } from "../generated/graphql";

export const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [register] = useRegisterMutation();

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:4000/refresh_token", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        setAccessToken(accessToken);
        setIsAuthenticated(true);
      } else {
        const registerResponse = await register();
        if (registerResponse.data && registerResponse.data.register) {
          setAccessToken(registerResponse.data.register.accessToken);
          setIsAuthenticated(true);
        } else {
          throw new Error("failed to register anonymous user");
        }
      }
    })();
  }, [register]);

  return isAuthenticated;
};
