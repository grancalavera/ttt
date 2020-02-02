import { useContext, useMemo } from "react";
import { AppContext } from "../app-context";

type LoadingMap = Map<symbol, true>;
const loading: LoadingMap = new Map();

export const useLoader = (show: boolean) => {
  const { setLoading } = useContext(AppContext);
  const id = useIdentity();

  const isKnown = loading.get(id) ?? false;
  const isUnknown = !isKnown;
  const hide = !show;

  if (show && isUnknown) {
    loading.set(id, true);
    setLoading(true);
  } else if (hide && isKnown) {
    loading.delete(id);
    if (allLoaded(loading)) {
      setLoading(false);
    }
  }
};

const useIdentity = () => useMemo(() => Symbol(), []);
const allLoaded = (map: LoadingMap) => map.size === 0;
