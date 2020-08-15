import { Card } from "@blueprintjs/core";
import styled from "styled-components/macro";

export const Cover = styled.div`
  width: calc(100% - ${({ theme }) => theme.padding * 2}px);
  height: calc(100% - ${({ theme }) => theme.padding * 2}px);
  position: absolute;
`;

export const Layout = styled(Card)`
  width: ${({ theme }) => theme.fullWidth}px;
  height: ${({ theme }) => theme.fullWidth}px;
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
  width: ${({ theme }) => theme.cellWidth}px;
  height: ${({ theme }) => theme.cellWidth}px;
  & > * {
    width: ${({ theme }) => theme.cellWidth}px;
    height: ${({ theme }) => theme.cellWidth}px;
  }
`;
