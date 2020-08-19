import { Button } from "@blueprintjs/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { useTheme } from "styled-components";
import { Cell, Screen } from "../layout/layout";

export const PlayGameContainer = () => {
  const history = useHistory();

  const handleClick = () => setTimeout(() => history.push("/"), 300);

  return (
    <Screen>
      <PlayButton onPlay={handleClick} />
      <PlayButton onPlay={handleClick} />
      <PlayButton onPlay={handleClick} />
      <PlayButton onPlay={handleClick} />
      <PlayButton onPlay={handleClick} />
      <PlayButton onPlay={handleClick} />
      <PlayButton onPlay={handleClick} />
      <PlayButton onPlay={handleClick} />
      <PlayButton onPlay={handleClick} />
    </Screen>
  );
};
interface PlayButtonProps {
  onPlay: () => void;
}

const PlayButton = ({ onPlay }: PlayButtonProps) => {
  const theme = useTheme();
  const size = theme.cellWidth - theme.padding;
  return (
    <Cell>
      <Button minimal style={{ width: size, height: size }} onClick={onPlay} />
    </Cell>
  );
};
