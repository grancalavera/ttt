import { useCallback, useContext, useEffect, useMemo } from "react";
import { AppContext } from "../app-context";

export const useLoader = (show: boolean) => {
  const { setLoading } = useContext(AppContext);
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

const loadingMap = new Map<symbol, true>();
const useIdentity = () => useMemo(() => Symbol(), []);
