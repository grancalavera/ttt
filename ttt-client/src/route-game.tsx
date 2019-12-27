import React from "react";
import { Redirect, useParams } from "react-router-dom";
import { Content } from "./common/layout";
import { useGameStatusQuery } from "./generated/graphql";

interface GameRouteParams {
  gameId: string;
}

export const GameRoute: React.FC = () => {
  const { gameId } = useParams<GameRouteParams>();
  const { loading, data, error } = useGameStatusQuery({
    variables: { gameId },
    fetchPolicy: "network-only",
  });

  if (!gameId) {
    console.error("missing required `gameId`");
    return <Redirect to="/" />;
  }

  if (error) {
    console.error(error);
    return <Redirect to="/" />;
  }

  return (
    <Content className="bp3-text-small">
      <code>{gameId}</code>
    </Content>
  );
};
