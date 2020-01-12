import React, { useCallback } from "react";
import { getAccessToken } from "../access-token";
import { Button, Intent } from "@blueprintjs/core";

export const CopyAuthHeader: React.FC = () => {
  const stealAccessToken = useCallback(() => {
    const accessToken = getAccessToken();
    const authHeader = `{"authorization": "bearer ${accessToken}"}`;
    navigator.clipboard.writeText(authHeader);
  }, []);

  return (
    <Button intent={Intent.DANGER} onClick={stealAccessToken}>
      Copy Authorization Header
    </Button>
  );
};
