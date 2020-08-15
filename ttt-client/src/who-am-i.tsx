import React from "react";
import { useWhoamiQuery } from "./generated/graphql";

export const WhoAmI: React.FC = () => {
  const result = useWhoamiQuery({
    fetchPolicy: "network-only",
  });
  const whoami = result.data?.whoami;
  return whoami ? <code>{whoami.id} </code> : null;
};
