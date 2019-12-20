import React from "react";
import { usePingQuery } from "./generated/graphql";
import { Loading } from "./common/loading";
import { LinkHome } from "./common/link-home";

export const Ping: React.FC = () => {
  const { data, loading, error } = usePingQuery({
    fetchPolicy: "network-only",
  });

  if (error) throw error;
  if (loading) return <Loading />;
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
