import React, { useEffect } from "react";
import { Cell, Screen } from "../layout/layout";
import { useParams, useHistory } from "react-router-dom";
import { Button } from "@blueprintjs/core";
import { useTheme } from "styled-components";

export const PlayGameContainer = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const history = useHistory();

  const handleClick = () => {
    setTimeout(() => {
      history.push("/");
    }, 1000);
  };

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
