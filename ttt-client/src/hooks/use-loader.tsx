import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRef } from "react";

const LoaderContext = React.createContext({
  isLoading: false,
  setLoading: (value: boolean): void => {
    throw new Error("LoaderContext.setLoading is not implemented");
  },
  loadingMap: new Map() as Map<symbol, true>,
});

type Props = { loadingMap?: Map<symbol, true> };

export const LoaderContextProvider: React.FC<Props> = ({
  children,
  loadingMap = new Map(),
}) => {
  const [isLoading, setLoading] = useState(false);
  return (
    <LoaderContext.Provider value={{ isLoading, setLoading, loadingMap }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const { isLoading, setLoading, loadingMap } = useContext(LoaderContext);
  const id = useIdentity();
  const mapRef = useRef(loadingMap);

  const showLoader = useCallback(() => {
    mapRef.current.set(id, true);
    setLoading(true);
  }, [id, setLoading]);

  const hideLoader = useCallback(() => {
    mapRef.current.delete(id);
    if (mapRef.current.size === 0) {
      setLoading(false);
    }
  }, [id, setLoading]);

  useEffect(() => hideLoader, [hideLoader]);

  const toggleLoader = useCallback(
    (show: boolean) => {
      const isKnown = mapRef.current.get(id) ?? false;

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

const useIdentity = () => useMemo(() => Symbol(), []);
