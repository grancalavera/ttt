import React from "react";
import { Redirect, useParams } from "react-router-dom";
import { Content } from "./common/layout";

interface GameRouteParams {
  gameId: string;
}

export const GameRoute: React.FC = () => {
  const { gameId } = useParams<GameRouteParams>();

  if (!gameId) {
    console.error("missing required `gameId`");
    return <Redirect to="/" />;
  }

  return (
    <Content className="bp3-text-small">
      <code>{gameId}</code>
    </Content>
  );
};
