import { useApplication } from "application";
import React, { useEffect } from "react";
import { useWhoamiLazyQuery } from "../generated/graphql";

export const WhoAmI: React.FC = () => {
  const { isAuthenticated } = useApplication();
  const [whoAmI, { data }] = useWhoamiLazyQuery({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (isAuthenticated) {
      whoAmI();
    }
  }, [whoAmI, isAuthenticated]);

  return data ? <code>{data.whoami.id} </code> : null;
};
