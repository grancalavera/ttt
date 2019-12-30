import React, { useCallback, useState } from "react";
import { ActivityState, isLoading } from "./common/activity-state";
import { useAuthentication } from "./hooks/use-authentication";

export interface Context {
  loading: boolean;
  authenticated: boolean;
  setLoading: (value: boolean) => void;
  setLoadingFromActivity: (activity: ActivityState<any>) => void;
}

export const AppContext = React.createContext<Context>({
  loading: false,
  authenticated: false,
  setLoading: () => {
    throw new Error("setLoading is not implemented");
  },
  setLoadingFromActivity: () => {
    throw new Error("setLoadingFromActivity is not implemented");
  },
});

export const AppContextProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const authenticated = useAuthentication();

  const setLoadingFromActivity = useCallback(
    activity => setLoading(isLoading(activity)),
    [setLoading]
  );

  return (
    <AppContext.Provider
      value={{ loading, setLoading, authenticated, setLoadingFromActivity }}
    >
      {children}
    </AppContext.Provider>
  );
};
