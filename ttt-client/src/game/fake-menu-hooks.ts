import { useCallback, useState } from "react";
import { v4 as uuid } from "uuid";

export const useFakeMutation = () => {
  const [data, setGameId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const joinGame = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGameId(uuid());
    }, 1000);
  }, []);

  return [joinGame, { data, loading }] as const;
};
