import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

export type LoadingState = readonly symbol[];
type LoadingMap = Map<symbol, true>;

const LoaderContext = React.createContext({
  isLoading: false,
  setLoading: (value: boolean): void => {
    throw new Error("LoaderContext.setLoading is not implemented");
  },
  loadingMap: new Map() as LoadingMap
});

interface LoaderContextProviderProps {
  loadingState?: LoadingState;
}

export const LoaderContextProvider: React.FC<LoaderContextProviderProps> = ({
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

  const toggleLoader = useCallback(
    (show: boolean) => {
      const isKnown = mapRef.current.has(id);

      if (show && !isKnown) {
        showLoader();
      } else if (!show && isKnown) {
        hideLoader();
      }
    },
    [hideLoader, id, showLoader]
  );

  const forceHide = useCallback(() => {
    mapRef.current.clear();
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    if (!isEmpty(mapRef.current)) {
      setLoading(true);
    }
    return hideLoader;
  }, [hideLoader, setLoading]);

  return { isLoading, toggleLoader, forceHide };
};

const useIdentity = () => useMemo(() => Symbol(), []);
const isEmpty = (m: Map<any, any>) => m.size === 0;
