import React, { useState } from "react";
import { useAuthentication } from "./hooks/use-authentication";

export interface Context {
  loading: boolean;
  authenticated: boolean;
  setLoading: (value: boolean) => void;
}

export const AppContext = React.createContext<Context>({
  loading: false,
  authenticated: false,
  setLoading: () => {
    throw new Error("setLoading is not implemented");
  },
});

export const AppContextProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const authenticated = useAuthentication();

  return (
    <AppContext.Provider value={{ loading, setLoading, authenticated }}>
      {children}
    </AppContext.Provider>
  );
};
