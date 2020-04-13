import { useEffect, useState } from "react";
import { useConfiguration } from "../configuration/configuration-context";
import { useRegisterUserMutation } from "../generated/graphql";
import { useSecurity } from "./security-context";

export const useAuthentication = () => {
  const { refreshJWTEndpoint } = useConfiguration();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registerUser] = useRegisterUserMutation();
  const { accessTokenRef } = useSecurity();

  useEffect(() => {
    (async () => {
      const response = await fetch(refreshJWTEndpoint.toString(), {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        accessTokenRef.current = accessToken;
        setIsAuthenticated(true);
      } else {
        const registerResponse = await registerUser();
        if (registerResponse.data && registerResponse.data.registerUser) {
          accessTokenRef.current = registerResponse.data.registerUser.accessToken;
          setIsAuthenticated(true);
        } else {
          throw new Error("failed to register anonymous user");
        }
      }
    })();
  }, [registerUser, refreshJWTEndpoint, accessTokenRef]);

  return isAuthenticated;
};
