import React, { useContext } from "react";
import { failProxy } from "../common/fail-proxy";

export type ReadAccessToken = () => string;
export type WriteAccessToken = (value: string) => void;

export interface AccessToken {
  value: string;
}

interface Security {
  accessToken: AccessToken;
}

const SecurityContext = React.createContext<Security>(failProxy("SecurityContext"));

export const SecurityProvider: React.FC = ({ children }) => {
  const accessToken = { value: "" };

  return (
    <SecurityContext.Provider value={{ accessToken }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useAccessToken = () => {
  const { accessToken } = useContext(SecurityContext);

  const readAccessToken = (): string => accessToken.value;

  const writeAccessToken = (value: string): void => {
    accessToken.value = value;
  };

  return { readAccessToken, writeAccessToken };
};
