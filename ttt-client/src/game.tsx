import React from "react";
import { Redirect, useParams } from "react-router-dom";

interface GameRouteParams {
  gameId?: string;
}

export const GameRoute: React.FC = () => {
  const { gameId } = useParams<GameRouteParams>();

  if (!gameId) {
    return <Redirect to="/" />;
  } else {
    return <pre>{gameId}</pre>;
  }
};
