import React from "react";
import { LinkHome } from "./common/link-home";
import { usePingQuery } from "./generated/graphql";

export const Ping: React.FC = () => {
  const { data, loading, error } = usePingQuery({
    fetchPolicy: "network-only",
  });

  if (error) throw error;
  if (loading) return null;
  if (data)
    return (
      <>
        <div>{data.ping}</div>
        <div>
          <LinkHome />
        </div>
      </>
    );
  throw new Error("undefined query state");
};
