import { useConfiguration } from "configuration/configuration-context";
import { useRegisterUserMutation } from "generated/graphql";
import { useEffect } from "react";
import { useSecurity } from "security";

export const useAuthentication = (): void => {
  const { refreshJWTEndpoint } = useConfiguration();
  const [registerUser] = useRegisterUserMutation();
  const { setAccessToken } = useSecurity();

  useEffect(() => {
    const runEffect = async () => {
      const response = await fetch(refreshJWTEndpoint.toString(), {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        setAccessToken(accessToken);
      } else {
        const registerResponse = await registerUser();
        if (registerResponse.data && registerResponse.data.registerUser) {
          setAccessToken(registerResponse.data.registerUser.accessToken);
        } else {
          throw new Error("failed to register anonymous user");
        }
      }
    };

    runEffect();
  }, [registerUser, refreshJWTEndpoint, setAccessToken]);
};
