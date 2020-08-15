import styled, { css } from "styled-components/macro";
import { Cover } from "./layout";

const LINE_HALF_WIDTH = 1;
const TRANSPARENT = "rgba(0, 0, 0, 0)";
const oneThird = (x: number) => x * (1 / 3);
const twoThirds = (x: number) => x * (2 / 3);

const gradientStyles = css(
  ({ theme }) => `
  // first row / col
  ${TRANSPARENT} ${oneThird(theme.contentWidth) - LINE_HALF_WIDTH}px,

  // first line
  ${theme.boardGridLine} ${oneThird(theme.contentWidth) - LINE_HALF_WIDTH}px,
  ${theme.boardGridLine} ${oneThird(theme.contentWidth) + LINE_HALF_WIDTH}px,

  // middle row / col
  ${TRANSPARENT} ${oneThird(theme.contentWidth) + LINE_HALF_WIDTH}px,
  ${TRANSPARENT} ${twoThirds(theme.contentWidth) - LINE_HALF_WIDTH}px,

  // second line
  ${theme.boardGridLine} ${twoThirds(theme.contentWidth) - LINE_HALF_WIDTH}px,
  ${theme.boardGridLine} ${twoThirds(theme.contentWidth) + LINE_HALF_WIDTH}px,

  // last row / col
  ${TRANSPARENT} ${twoThirds(theme.contentWidth) + LINE_HALF_WIDTH}px`
);

export const Background = styled(Cover)`
  background-image: linear-gradient(to right, ${gradientStyles}),
    linear-gradient(to bottom, ${gradientStyles});
`;
