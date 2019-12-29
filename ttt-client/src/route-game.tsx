import React, { useContext } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Content } from "./common/layout";
import { useGameStatusQuery } from "./generated/graphql";
import { AppContext } from "./app-context";

interface GameRouteParams {
  gameId: string;
}

export const GameRoute: React.FC = () => {
  const { gameId } = useParams<GameRouteParams>();
  const { setLoading } = useContext(AppContext);

  const { loading, data, error } = useGameStatusQuery({
    variables: { gameId },
    fetchPolicy: "no-cache",
  });

  setLoading(loading);

  if (!gameId) {
    console.error("missing required `gameId`");
    return <Redirect to="/" />;
  }

  if (error) {
    console.error(error);
    return <Redirect to="/" />;
  }

  if (data) {
    return (
      <Content className="bp3-text-small">
        <pre>{JSON.stringify(data.gameStatus, null, 2)}</pre>
      </Content>
    );
  }

  if (loading) {
    return null;
  }

  throw new Error("Invalid data state for GameRoute");
};
