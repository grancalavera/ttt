import React, { useContext, useEffect } from "react";
import { useWhoamiLazyQuery } from "../generated/graphql";
import { AppContext } from "../app-context";

export const WhoAmI: React.FC = () => {
  const { authenticated } = useContext(AppContext);
  const [whoAmI, { data }] = useWhoamiLazyQuery({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (authenticated) {
      whoAmI();
    }
  }, [whoAmI, authenticated]);

  return data ? (
    <code className="bp3-text-small" style={{ position: "absolute" }}>
      {data.whoami}
    </code>
  ) : null;
};
