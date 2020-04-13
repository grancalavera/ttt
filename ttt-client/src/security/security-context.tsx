import { failProxy } from "common";
import React, { useContext, useRef } from "react";

export type AccessTokenRef = React.MutableRefObject<string>;

interface Security {
  accessTokenRef: AccessTokenRef;
}

const SecurityContext = React.createContext<Security>(failProxy("SecurityContext"));

export const SecurityProvider: React.FC = ({ children }) => {
  const accessTokenRef = useRef("");

  return (
    <SecurityContext.Provider value={{ accessTokenRef }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);