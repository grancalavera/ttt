import { Maybe } from "@grancalavera/ttt-core";
import { failProxy } from "common/fail-proxy";
import React, { useContext, useState } from "react";
import { GlobalStyle } from "../common/global-style";
import { Token } from "generated/graphql";
import { LoaderProvider } from "loader";

interface Application {
  gameId: string;
  setGameId: (x: string) => void;
  token: Maybe<Token>;
  setToken: (x: Maybe<Token>) => void;
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
