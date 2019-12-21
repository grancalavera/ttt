import React from "react";
import { Loading } from "./common/loading";
import { LinkHome } from "./common/link-home";
import { useWhoamiQuery } from "./generated/graphql";

export const Whoami: React.FC = () => {
  const { data, loading, error } = useWhoamiQuery({
    fetchPolicy: "network-only",
  });

  if (error) {
    throw error;
  }

  if (loading) {
    return <Loading />;
  }

  if (data) {
    return (
      <>
        <div>{data.whoami}</div>
        <div>
          <LinkHome />
        </div>
      </>
    );
  }

  throw new Error("undefined query state");
};
