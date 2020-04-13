import { useLoader } from "loader/loader-context";
import { useCallback, useEffect, useMemo, useRef } from "react";

export const useLoading = () => {
  const { isLoading, setLoading, loadingMap } = useLoader();
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

  const toggleLoading = useCallback(
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

  const forceHideLoading = useCallback(() => {
    mapRef.current.clear();
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    if (!isEmpty(mapRef.current)) {
      setLoading(true);
    }
    return hideLoader;
  }, [hideLoader, setLoading]);

  return { isLoading, toggleLoading, forceHideLoading };
};

const useIdentity = () => useMemo(() => Symbol(), []);
const isEmpty = (m: Map<any, any>) => m.size === 0;
