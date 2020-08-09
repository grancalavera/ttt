import { Colors } from "@blueprintjs/core";
import { useStore } from "app-store";
import React from "react";
import { ThemeProvider } from "styled-components";

interface TTTTheme {
  accent: string;
  isDark: boolean;
  contentWidth: number;
  padding: number;
  fullWidth: number;
  cellWidth: number;
}

const contentWidth = 300;
const padding = 20;
const fullWidth = padding * 2 + contentWidth;
const cellWidth = contentWidth / 3 - padding;

declare module "styled-components" {
  export interface DefaultTheme extends TTTTheme {}
}

export const TTTThemeProvider: React.FC = ({ children }) => {
  const isDark = useStore((s) => s.isDark);

  const theme: TTTTheme = {
    isDark,
    accent: isDark ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY3,

    padding,
    contentWidth,
    fullWidth,
    cellWidth,
  };

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
