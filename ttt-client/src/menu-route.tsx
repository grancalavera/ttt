import { Button, Tooltip, Icon, Colors } from "@blueprintjs/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { hoverOpenDelay } from "./app-constants";
import { Cell, Screen } from "./layout";
import { useTheme } from "styled-components";

export const MenuRoute: React.FC = () => {
  const history = useHistory();
  const theme = useTheme();

  const handlePlay = () => {
    history.push("/game");
  };

  return (
    <Screen>
      <Cell>
        <Tooltip content="new game" hoverOpenDelay={hoverOpenDelay}>
          <Button icon="add" onClick={handlePlay} large intent="primary" />
        </Tooltip>
      </Cell>

      <Cell>
        <Tooltip content="waiting for opponent's turn" hoverOpenDelay={hoverOpenDelay}>
          <Icon icon="time" intent="warning" />
        </Tooltip>
      </Cell>

      <Cell>
        <Tooltip content="is your turn" hoverOpenDelay={hoverOpenDelay}>
          <Button icon="play" large intent="success" />
        </Tooltip>
      </Cell>

      <Cell>
        <Tooltip content="is your turn" hoverOpenDelay={hoverOpenDelay}>
          <Button icon="play" large intent="success" />
        </Tooltip>
      </Cell>

      <Cell>
        <Tooltip content="waiting for opponent's turn" hoverOpenDelay={hoverOpenDelay}>
          <Icon icon="time" intent="warning" />
        </Tooltip>
      </Cell>

      <Cell>
        <Tooltip content="waiting for opponent's turn" hoverOpenDelay={hoverOpenDelay}>
          <Icon icon="time" intent="warning" />
        </Tooltip>
      </Cell>

      <Cell>
        <Tooltip content="waiting for opponent's turn" hoverOpenDelay={hoverOpenDelay}>
          <Icon icon="time" intent="warning" />
        </Tooltip>
      </Cell>

      <Cell>
        <Tooltip content="is your turn" hoverOpenDelay={hoverOpenDelay}>
          <Button icon="play" large intent="success" />
        </Tooltip>
      </Cell>
    </Screen>
  );
};
