import styled from "styled-components/macro";
import { Card } from "@blueprintjs/core";

export const PADDING = 20;
export const CONTENT_WIDTH = 300;
export const FULL_WIDTH = PADDING * 2 + CONTENT_WIDTH;

export const Cover = styled.div`
  width: calc(100% - ${PADDING * 2}px);
  height: calc(100% - ${PADDING * 2}px);
  position: absolute;
`;

export const Layout = styled(Card)`
  width: ${FULL_WIDTH}px;
  height: ${FULL_WIDTH}px;
  position: relative;
  margin: auto;
  overflow: hidden;
`;

export const Content = styled(Cover)`
  display: grid;
`;
