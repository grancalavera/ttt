import { Card } from "@blueprintjs/core";
import React, { FC } from "react";
import styled, { css } from "styled-components/macro";
import { gridImage } from "./grid-image";
import { Stroke, strokeImage } from "./stroke-image";

const centerChildren = css`
  display: grid;
  place-items: center;
`;

const Cover = styled.div`
  ${centerChildren};
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: absolute;
`;

const Content = styled(Card)`
  ${centerChildren};
  width: ${({ theme }) => theme.outerWidth}px;
  height: ${({ theme }) => theme.outerWidth}px;
  padding: ${({ theme }) => theme.padding}px;
  overflow: hidden;
`;

const Grid = styled.div`
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  width: ${({ theme }) => theme.innerWidth}px;
  height: ${({ theme }) => theme.innerWidth}px;
  ${gridImage};
`;

const StrokeImage = styled.div<{ s: Stroke }>`
  width: ${({ theme }) => theme.innerWidth}px;
  height: ${({ theme }) => theme.innerWidth}px;
  ${strokeImage};
`;

export const Cell = styled.span`
  ${centerChildren};
  width: ${({ theme }) => theme.cellWidth}px;
  height: ${({ theme }) => theme.cellWidth}px;
`;

export const Screen: FC = ({ children }) => (
  <Cover>
    <Content>
      <Grid>{children}</Grid>
    </Content>
  </Cover>
);

export const StrokeLayer: React.FC<{ s: Stroke }> = ({ s }) => (
  <Cover>
    <StrokeImage s={s} />
  </Cover>
);
