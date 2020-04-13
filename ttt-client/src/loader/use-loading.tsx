import { useLoader } from "loader/loader-context";
import { useCallback, useEffect, useMemo } from "react";

export const useLoading = () => {
  const { isLoading, setLoading, loadingMapRef } = useLoader();
  const id = useIdentity();

  const showLoader = useCallback(() => {
    loadingMapRef.current.set(id, true);
    setLoading(true);
  }, [id, setLoading, loadingMapRef]);

  const hideLoader = useCallback(() => {
    loadingMapRef.current.delete(id);
    if (loadingMapRef.current.size === 0) {
      setLoading(false);
    }
  }, [id, setLoading, loadingMapRef]);

  const toggleLoading = useCallback(
    (show: boolean) => {
      const isKnown = loadingMapRef.current.has(id);

      if (show && !isKnown) {
        showLoader();
      } else if (!show && isKnown) {
        hideLoader();
      }
    },
    [hideLoader, id, showLoader, loadingMapRef]
  );

  const forceHideLoading = useCallback(() => {
    loadingMapRef.current.clear();
    setLoading(false);
  }, [setLoading, loadingMapRef]);

  useEffect(() => {
    if (!isEmpty(loadingMapRef.current)) {
      setLoading(true);
    }
    return hideLoader;
  }, [hideLoader, setLoading, loadingMapRef]);

  return { isLoading, toggleLoading, forceHideLoading };
};

const useIdentity = () => useMemo(() => Symbol(), []);
const isEmpty = (m: Map<any, any>) => m.size === 0;
