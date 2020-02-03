import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";

const LoaderContext = React.createContext({
  loading: false,
  setLoading: (value: boolean): void => {
    throw new Error("LoaderContext.setLoading is not implemented");
  },
});

export const LoaderContextProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = (show: boolean) => {
  const { setLoading } = useContext(LoaderContext);
  const id = useIdentity();

  const hideLoader = useCallback(() => {
    loadingMap.delete(id);
    if (loadingMap.size === 0) {
      setLoading(false);
    }
  }, [id, setLoading]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => hideLoader, []);

  const isKnown = loadingMap.get(id) ?? false;

  if (show && !isKnown) {
    loadingMap.set(id, true);
    setLoading(true);
  } else if (!show && isKnown) {
    hideLoader();
  }
};

export const useIsLoading = () => {
  const { loading } = useContext(LoaderContext);
  return loading;
};

const loadingMap = new Map<symbol, true>();
const useIdentity = () => useMemo(() => Symbol(), []);
