import { css } from "styled-components/macro";
import { Theme } from "./theme";
import { enumerate } from "@grancalavera/ttt-etc";

export type Stroke = "d1" | "d2" | "h1" | "h2" | "h3" | "v1" | "v2" | "v3";

export const strokes = enumerate<Stroke>()(
  "d1",
  "d2",
  "h1",
  "h2",
  "h3",
  "v1",
  "v2",
  "v3"
);

const stopDef = (angle: number, unit: "%" | "px") => (
  start: number,
  end: number
): [number, string, string] => [angle, `${start}${unit}`, `${end}${unit}`];

const hStopDef = stopDef(0, "px");
const vStopDef = stopDef(90, "px");

const strokeToStop = (s: Stroke, theme: Theme): [number, string, string] => {
  const scale = 8;
  const diagonalHalfWith = 0.2 * scale;
  const halfWidth = 1 * scale;

  const dStart = 50 - diagonalHalfWith;
  const dEnd = 50 + diagonalHalfWith;

  const s1 = theme.cellWidth / 2 - halfWidth;
  const e1 = theme.cellWidth / 2 + halfWidth;
  const s2 = theme.cellWidth + s1;
  const e2 = theme.cellWidth + e1;
  const s3 = theme.cellWidth + s2;
  const e3 = theme.cellWidth + e2;

  switch (s) {
    case "d1":
      return stopDef(45, "%")(dStart, dEnd);
    case "d2":
      return stopDef(-45, "%")(dStart, dEnd);
    case "h1":
      return hStopDef(s1, e1);
    case "h2":
      return hStopDef(s2, e2);
    case "h3":
      return hStopDef(s3, e3);
    case "v1":
      return vStopDef(s1, e1);
    case "v2":
      return vStopDef(s2, e2);
    case "v3":
      return vStopDef(s3, e3);
    default:
      const never: never = s;
      throw new Error(`unhandled stroke type ${never}`);
  }
};

export const strokeImage = css<{ s: Stroke }>(({ theme, s }) => {
  const [angle, stop1, stop2] = strokeToStop(s, theme);

  return `
  background:
    linear-gradient(${angle}deg,
      ${theme.transparent} ${stop1},
      ${theme.stroke} ${stop1},
      ${theme.stroke} ${stop2},
      ${theme.transparent} ${stop2}
    );
`;
});
