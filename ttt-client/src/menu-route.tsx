import React from "react";
import { useTheme } from "styled-components";
import { Cell, Layer, StrokeLayer } from "./layout";

export const MenuRoute: React.FC = () => {
  const { opponent, player } = useTheme();
  return (
    <>
      <Layer>
        <Cell></Cell>
        <Cell>
          <span style={{ fontSize: 40, color: opponent }}>O</span>
        </Cell>
        <Cell>
          <span style={{ fontSize: 40, color: player }}>X</span>
        </Cell>

        <Cell></Cell>
        <Cell>
          <span style={{ fontSize: 40, color: player }}>X</span>
        </Cell>
        <Cell></Cell>

        <Cell>
          <span style={{ fontSize: 40, color: player }}>X</span>
        </Cell>
        <Cell>
          <span style={{ fontSize: 40, color: opponent }}>O</span>
        </Cell>
        <Cell></Cell>
      </Layer>
      <StrokeLayer s="d2" />
    </>
  );
};
