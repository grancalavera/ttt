import { Card } from "@blueprintjs/core";
import styled from "styled-components/macro";

export const PADDING = 20;
export const CONTENT_WIDTH = 300;
export const FULL_WIDTH = PADDING * 2 + CONTENT_WIDTH;
const CELL_WIDTH = CONTENT_WIDTH / 3 - PADDING;

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
  align-items: center;
  justify-content: center;
  vertical-align: middle;
`;

export const BoardLayout = styled(Cover)`
  display: grid;
  grid-template-areas:
    "cell cell cell"
    "cell cell cell"
    "cell cell cell";
`;

export const CellLayout = styled.div`
  justify-self: center;
  align-self: center;
  user-select: none;
  width: ${CELL_WIDTH}px;
  height: ${CELL_WIDTH}px;
  & > * {
    width: ${CELL_WIDTH}px;
    height: ${CELL_WIDTH}px;
  }
`;
