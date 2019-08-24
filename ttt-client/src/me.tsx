import React, { FC } from "react";
import { useQuery } from "react-apollo";
import { loader } from "graphql.macro";
import { MeQuery } from "./generated/models";

const QUERY_ME = loader("./query-me.graphql");

export const Me: FC = () => {
  const { data, loading } = useQuery<MeQuery>(QUERY_ME, { fetchPolicy: "network-only" });
  return (
    <>
      {loading && <p>loading... </p>}
      {data && data.me ? (
        <p>
          welcome <strong>{data.me.email}</strong>!
        </p>
      ) : null}
    </>
  );
};
