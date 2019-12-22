import { Colors } from "@blueprintjs/core";
import styled from "styled-components/macro";
import { CONTENT_WIDTH, Cover } from "./layout";

const BOARD_COLOR = Colors.DARK_GRAY3;
const BOARD_LINE_HALF_WIDTH = 1;
const ONE_THIRD = CONTENT_WIDTH * (1 / 3);
const TWO_THIRDS = CONTENT_WIDTH * (2 / 3);

export const Background = styled(Cover)`
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) ${ONE_THIRD - BOARD_LINE_HALF_WIDTH}px,
      ${BOARD_COLOR} ${ONE_THIRD - BOARD_LINE_HALF_WIDTH}px,
      ${BOARD_COLOR} ${ONE_THIRD + BOARD_LINE_HALF_WIDTH}px,
      rgba(0, 0, 0, 0) ${ONE_THIRD + BOARD_LINE_HALF_WIDTH}px,
      rgba(0, 0, 0, 0) ${TWO_THIRDS - BOARD_LINE_HALF_WIDTH}px,
      ${BOARD_COLOR} ${TWO_THIRDS - BOARD_LINE_HALF_WIDTH}px,
      ${BOARD_COLOR} ${TWO_THIRDS + BOARD_LINE_HALF_WIDTH}px,
      rgba(0, 0, 0, 0) ${TWO_THIRDS + BOARD_LINE_HALF_WIDTH}px
    ),
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) ${ONE_THIRD - BOARD_LINE_HALF_WIDTH}px,
      ${BOARD_COLOR} ${ONE_THIRD - BOARD_LINE_HALF_WIDTH}px,
      ${BOARD_COLOR} ${ONE_THIRD + BOARD_LINE_HALF_WIDTH}px,
      rgba(0, 0, 0, 0) ${ONE_THIRD + BOARD_LINE_HALF_WIDTH}px,
      rgba(0, 0, 0, 0) ${TWO_THIRDS - BOARD_LINE_HALF_WIDTH}px,
      ${BOARD_COLOR} ${TWO_THIRDS - BOARD_LINE_HALF_WIDTH}px,
      ${BOARD_COLOR} ${TWO_THIRDS + BOARD_LINE_HALF_WIDTH}px,
      rgba(0, 0, 0, 0) ${TWO_THIRDS + BOARD_LINE_HALF_WIDTH}px
    );
`;
