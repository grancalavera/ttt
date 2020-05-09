import { ApolloLink, FetchResult, Observable } from "@apollo/client";
import { assertNever } from "@grancalavera/ttt-core";
import { useApplication } from "application";
import { useConfiguration } from "configuration";
import { useRegisterUserMutation } from "generated/graphql";
import { decode } from "jsonwebtoken";
import { useMemo } from "react";

type AuthorizationStatus =
  | "NotAuthorized"
  | "AuthorizationExpired"
  | "AuthorizationValid";

const authorizationStatus = (accessToken: string): AuthorizationStatus => {
  const jwt = decode(accessToken);

  if (!jwt || typeof jwt === "string" || !jwt.exp || typeof jwt.exp !== "number") {
    return "NotAuthorized";
  }

  if (1000 * jwt.exp < Date.now()) {
    return "AuthorizationExpired";
  }

  return "AuthorizationValid";
};

export const useAnonymousUser = () => {
  const { refreshJWTEndpoint } = useConfiguration();
  const { accessToken, login } = useApplication();
  // const [registerUser] = useRegisterUserMutation();

  const refreshJWT = useMemo(() => {
    return async () => {
      const response = await fetch(refreshJWTEndpoint.toString(), {
        method: "POST",
        credentials: "include",
      });
      const parsedResponse = await response.json();
      return parsedResponse.accessToken as string;
    };
  }, [refreshJWTEndpoint]);

  return new ApolloLink((operation, forward) => {
    const status = authorizationStatus(accessToken);
    switch (status) {
      case "NotAuthorized":
        return forward(operation);
      case "AuthorizationExpired":
        return new Observable<FetchResult>((observer) => {
          refreshJWT().then((refreshedAccessToken) => {
            login(refreshedAccessToken);
            forward(operation).subscribe(observer);
          });
        });
      case "AuthorizationValid":
        return forward(operation);
      default:
        assertNever(status);
    }
  });
};

// not authenticated, then refresh
// refresh failed, then register user
// register failed, then boom
