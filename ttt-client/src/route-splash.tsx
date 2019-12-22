import { Button } from "@blueprintjs/core";
import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AppContext } from "./app-context";
import { Content } from "./common/layout";
import { useJoinMutation } from "./generated/graphql";

export const SplashRoute: React.FC = () => {
  const [join, { data, loading }] = useJoinMutation();
  const { setIsLoading } = useContext(AppContext);
  setIsLoading(loading);

  if (data) {
    const { gameId } = data.join;
    return <Redirect to={`/game/${gameId}`} />;
  }

  if (!data && !loading) {
    return (
      <Content>
        <Button icon="play" onClick={() => join()} />
      </Content>
    );
  }

  return null;
};
