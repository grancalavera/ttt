import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";

const LoaderContext = React.createContext({
  isLoading: false,
  setLoading: (value: boolean): void => {
    throw new Error("LoaderContext.setLoading is not implemented");
  },
});

export const LoaderContextProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoaderContext.Provider value={{ isLoading: loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const { isLoading, setLoading } = useContext(LoaderContext);
  const id = useIdentity();

  const showLoader = useCallback(() => {
    loadingMap.set(id, true);
    setLoading(true);
  }, [id, setLoading]);

  const hideLoader = useCallback(() => {
    loadingMap.delete(id);
    if (loadingMap.size === 0) {
      setLoading(false);
    }
  }, [id, setLoading]);

  useEffect(() => hideLoader, [hideLoader]);

  const toggleLoader = useCallback(
    (show: boolean) => {
      const isKnown = loadingMap.get(id) ?? false;

      if (show && !isKnown) {
        showLoader();
      } else if (!show && isKnown) {
        hideLoader();
      }
    },
    [hideLoader, id, showLoader]
  );

  return { isLoading, toggleLoader };
};

const loadingMap = new Map<symbol, true>();
const useIdentity = () => useMemo(() => Symbol(), []);
