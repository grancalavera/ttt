import React, { useState } from "react";
import { useAuthentication } from "./hooks/use-authentication";

export const AppContext = React.createContext({
  loading: false,
  authenticated: false,
  setLoading: (value: boolean): void => {
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

export const RouteContext = React.createContext({
  setLoading: (value: boolean): void => {
    throw new Error("ApplicationRouterContext.setLoading not implemented");
  },
});
