import { Maybe } from "@grancalavera/ttt-core";
import { SetState } from "common";
import { failProxy } from "common/fail-proxy";
import { Token } from "generated/graphql";
import { LoaderProvider } from "loader";
import React, { useContext, useState } from "react";
import { GlobalStyle } from "../common/global-style";

interface Application {
  gameId: string;
  setGameId: SetState<string>;
  token: Maybe<Token>;
  setToken: SetState<Maybe<Token>>;
}

const ApplicationContext = React.createContext<Application>(
  failProxy("ApplicationContext")
);

export const ApplicationProvider: React.FC = ({ children }) => {
  const [gameId, setGameId] = useState("");
  const [token, setToken] = useState<Maybe<Token>>();

  return (
    <>
      <GlobalStyle />
      <LoaderProvider>
        <ApplicationContext.Provider value={{ gameId, setGameId, token, setToken }}>
          {children}
        </ApplicationContext.Provider>
      </LoaderProvider>
    </>
  );
};

export const useApplication = () => useContext(ApplicationContext);
