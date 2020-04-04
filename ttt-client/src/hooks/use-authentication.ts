import { useEffect, useState } from "react";
import { setAccessToken } from "../access-token";
import { useRegisterUserMutation } from "../generated/graphql";

export const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registerUser] = useRegisterUserMutation();

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
        const registerResponse = await registerUser();
        if (registerResponse.data && registerResponse.data.registerUser) {
          setAccessToken(registerResponse.data.registerUser.accessToken);
          setIsAuthenticated(true);
        } else {
          throw new Error("failed to register anonymous user");
        }
      }
    })();
  }, [registerUser]);

  return isAuthenticated;
};
