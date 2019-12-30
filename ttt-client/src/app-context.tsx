import React, { useState } from "react";
import { useAuthentication } from "./hooks/use-authentication";
import { ActivityState, isLoading } from "./common/activity-state";
import { useCallback } from "react";
import { flow } from "lodash/fp";

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

  const setLoadingFromActivity = useCallback(flow([isLoading, setLoading]), [setLoading]);

  return (
    <AppContext.Provider
      value={{ loading, setLoading, authenticated, setLoadingFromActivity }}
    >
      {children}
    </AppContext.Provider>
  );
};
