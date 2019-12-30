import { assertNever } from "@grancalavera/ttt-core";
import React, { useContext } from "react";
import { Redirect, useParams } from "react-router-dom";
import { AppContext } from "./app-context";
import { Content } from "./common/layout";
import { queryState } from "./common/query-state";
import { useGameStatusQuery } from "./generated/graphql";

interface GameRouteParams {
  gameId: string;
}

export const GameRoute: React.FC = () => {
  const { gameId } = useParams<GameRouteParams>();
  const { setLoading } = useContext(AppContext);
  const qResult = useGameStatusQuery({
    variables: { gameId },
    fetchPolicy: "no-cache",
  });

  if (!gameId) {
    console.error("missing required `gameId`");
    return <Redirect to="/" />;
  }

  const qState = queryState(qResult);

  setLoading(qState.kind === "QueryLoading");

  switch (qState.kind) {
    case "QueryIdle":
      return null;
    case "QueryLoading":
      return null;
    case "QueryFailed":
      console.error(qState.error);
      return <Redirect to="/" />;
    case "QuerySuccess":
      return (
        <Content className="bp3-text-small">
          <pre>{JSON.stringify(qState.data.gameStatus, null, 2)}</pre>
        </Content>
      );
    default:
      return assertNever(qState);
  }
};
