import { assertNever, Maybe } from "@grancalavera/ttt-core";
import { SetState } from "common";
import { failProxy } from "common/fail-proxy";
import { Token } from "generated/graphql";
import { LoaderProvider } from "loader";
import React, { useContext, useReducer, useState, useCallback } from "react";
import { GlobalStyle } from "../common/global-style";

type AccessToken = string;

interface Application {
  gameId: string;
  setGameId: SetState<string>;
  token: Maybe<Token>;
  setToken: SetState<Maybe<Token>>;

  readonly state: ApplicationState;
  readonly dispatch: React.Dispatch<ApplicationAction>;
}

interface ApplicationState {
  readonly accessToken: string;
  readonly isAuthenticated: boolean;
}

export type ApplicationAction =
  | { kind: "login"; payload: AccessToken }
  | { kind: "logout" };

const logout = (state: ApplicationState): ApplicationState => ({
  ...state,
  accessToken: "",
  isAuthenticated: false,
});

const login = (state: ApplicationState, accessToken: AccessToken): ApplicationState => ({
  ...state,
  accessToken,
  isAuthenticated: true,
});

const applicationReducer = (
  state: ApplicationState,
  action: ApplicationAction
): ApplicationState => {
  switch (action.kind) {
    case "login":
      return action.payload !== "" ? login(state, action.payload) : logout(state);
    case "logout":
      return logout(state);
    default:
      assertNever(action);
  }
};

const ApplicationContext = React.createContext<Application>(
  failProxy("ApplicationContext")
);

export const ApplicationProvider: React.FC = ({ children }) => {
  const [gameId, setGameId] = useState("");
  const [token, setToken] = useState<Maybe<Token>>();
  const [state, dispatch] = useReducer(applicationReducer, {
    accessToken: "",
    isAuthenticated: false,
  });

  return (
    <>
      <GlobalStyle />
      <LoaderProvider>
        <ApplicationContext.Provider
          value={{ gameId, setGameId, token, setToken, state, dispatch }}
        >
          {children}
        </ApplicationContext.Provider>
      </LoaderProvider>
    </>
  );
};

export const useApplication = () => {
  const { dispatch, state, gameId, token } = useContext(ApplicationContext);

  const login = useCallback(
    (payload: AccessToken) => {
      dispatch({ kind: "login", payload });
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch({ kind: "logout" });
  }, [dispatch]);

  return { ...state, gameId, token, login, logout };
};
