import { failProxy } from "common";
import React, { useContext, useState } from "react";

export type LoadingState = readonly symbol[];
export type LoadingMap = Map<symbol, true>;

interface Loader {
  isLoading: boolean;
  setLoading: (x: boolean) => void;
  loadingMap: LoadingMap;
}

const LoaderContext = React.createContext<Loader>(failProxy("LoaderContext"));

interface LoaderContextProviderProps {
  loadingState?: LoadingState;
}

export const LoaderProvider: React.FC<LoaderContextProviderProps> = ({
  children,
  loadingState = []
}) => {
  const [isLoading, setLoading] = useState(false);
  const loadingMap: LoadingMap = new Map(loadingState.map(s => [s, true]));
  return (
    <LoaderContext.Provider value={{ isLoading, setLoading, loadingMap }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
