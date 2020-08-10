import { Button, Tooltip } from "@blueprintjs/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { Content } from "../common/layout";

export const MenuRoute: React.FC = () => {
  const history = useHistory();

  const handlePlay = () => {
    history.push("/game");
  };

  return (
    <Content>
      <Tooltip content="new game" hoverOpenDelay={500}>
        <Button icon="play" onClick={handlePlay} />
      </Tooltip>
    </Content>
  );
};
