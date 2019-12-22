import React from "react";
import { Redirect, useParams } from "react-router-dom";
import { LinkHome } from "./common/link-home";
import { Content } from "./common/layout";

interface GameRouteParams {
  gameId?: string;
}

export const GameRoute: React.FC = () => {
  const { gameId } = useParams<GameRouteParams>();

  if (!gameId) {
    return <Redirect to="/" />;
  } else {
    return (
      <Content>
        <div>
          <pre>{gameId}</pre>
          <LinkHome />
        </div>
      </Content>
    );
  }
};
