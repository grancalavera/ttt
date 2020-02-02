import { useContext, useMemo } from "react";
import { AppContext } from "../app-context";

export const useLoader = (show: boolean) => {
  const { setLoading } = useContext(AppContext);
  const id = useIdentity();
  const isKnown = loadingMap.get(id) ?? false;

  if (show && !isKnown) {
    loadingMap.set(id, true);
    setLoading(true);
  } else if (!show && isKnown) {
    loadingMap.delete(id);
    if (loadingMap.size === 0) {
      setLoading(false);
    }
  }
};

const loadingMap = new Map<symbol, true>();
const useIdentity = () => useMemo(() => Symbol(), []);
