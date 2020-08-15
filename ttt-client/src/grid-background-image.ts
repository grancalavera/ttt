import { css } from "styled-components/macro";
import { Theme } from "./theme";

const transparent = "rgba(0, 0, 0, 0)";

const lineHalfWidth = 1;
const gradientStop = (theme: Theme, side: -1 | 1 = -1, offset: 1 | 2 = 1) =>
  theme.cellWidth * offset + lineHalfWidth * side;

const gridGradient = css(
  ({ theme }) => `
  // first row / col
  ${transparent} ${gradientStop(theme)}px,

  // first line
  ${theme.accent} ${gradientStop(theme)}px,
  ${theme.accent} ${gradientStop(theme, 1)}px,

  // middle row / col
  ${transparent} ${gradientStop(theme, 1)}px,
  ${transparent} ${gradientStop(theme, -1, 2)}px,

  // second line
  ${theme.accent} ${gradientStop(theme, -1, 2)}px,
  ${theme.accent} ${gradientStop(theme, 1, 2)}px,

  // last row / col
  ${transparent} ${gradientStop(theme, 1, 2)}px`
);

// prettier-ignore
export const gridBackgroundImage = css`
  background-image:
    linear-gradient(to right, ${gridGradient}),
    linear-gradient(to bottom, ${gridGradient});
`
