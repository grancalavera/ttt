import React, { useEffect } from "react";
import { useSecurity } from "security";
import { useWhoamiLazyQuery } from "../generated/graphql";

export const WhoAmI: React.FC = () => {
  const authenticated = useSecurity();
  const [whoAmI, { data }] = useWhoamiLazyQuery({
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (authenticated) {
      whoAmI();
    }
  }, [whoAmI, authenticated]);

  return data ? <code>{data.whoami.id} </code> : null;
};
