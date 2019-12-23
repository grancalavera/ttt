import { Button } from "@blueprintjs/core";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "./app-context";
import { Content } from "./common/layout";
import { useJoinMutation } from "./generated/graphql";

export const SplashRoute: React.FC = () => {
  const [join, { data, loading }] = useJoinMutation();
  const history = useHistory();
  const { setIsLoading } = useContext(AppContext);

  setIsLoading(loading);

  useEffect(() => {
    if (data) {
      history.push(`/game/${data.join}`);
    }
  }, [data, history]);

  if (!data && !loading) {
    return (
      <Content>
        <Button icon="play" onClick={() => join()} />
      </Content>
    );
  }

  return null;
};
