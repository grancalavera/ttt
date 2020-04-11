import React, { useState } from "react";
import { useAuthentication } from "./hooks/use-authentication";
import { Token } from "./generated/graphql";
import { Maybe } from "@grancalavera/ttt-core";

export const AppContext = React.createContext({
  authenticated: false,

  gameId: "",
  setGameId: (value: string): void => {
    throw new Error("setGameId is not implemented");
  },

  token: undefined as Maybe<Token>,
  setToken: (value: Token): void => {
    throw new Error("setToken is not implemented");
  },
});

export const AppContextProvider: React.FC = ({ children }) => {
  const [gameId, setGameId] = useState("");
  const [token, setToken] = useState<Maybe<Token>>();
  const authenticated = useAuthentication();

  return (
    <AppContext.Provider value={{ authenticated, gameId, setGameId, token, setToken }}>
      {children}
    </AppContext.Provider>
  );
};
