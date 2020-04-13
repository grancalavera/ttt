import { failProxy, SetState } from "common";
import React, { useContext, useMemo, useState } from "react";

interface Security {
  isAuthenticated: boolean;
  accessToken: string;
  setAccessToken: SetState<string>;
}

const SecurityContext = React.createContext<Security>(failProxy("SecurityContext"));

export const SecurityProvider: React.FC = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const isAuthenticated = useMemo(() => {
    return accessToken !== "";
  }, [accessToken]);

  return (
    <SecurityContext.Provider value={{ isAuthenticated, accessToken, setAccessToken }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
