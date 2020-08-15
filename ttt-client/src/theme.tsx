import { Colors, FocusStyleManager } from "@blueprintjs/core";
import React from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { createGlobalStyle } from "styled-components/macro";
import { useAppState } from "./app-state";
import chroma from "chroma-js";

FocusStyleManager.onlyShowFocusOnTabs();

export interface Theme {
  gridLine: string;
  stroke: string;
  isDark: boolean;
  padding: number;
  cellWidth: number;
  innerWidth: number;
  outerWidth: number;
  transparent: string;
  player: string;
  opponent: string;
}

const padding = 20;
const cellWidth = 100;
const innerWidth = cellWidth * 3;
const outerWidth = innerWidth + padding * 2;

const defaultTheme: Theme = {
  padding,
  cellWidth,
  innerWidth,
  outerWidth,
  isDark: true,
  transparent: "rgba(0, 0, 0, 0)",
  gridLine: "",
  stroke: "",
  player: "",
  opponent: "",
};
const alpha = (c: string) => chroma(c).alpha(0.9).hex();

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}

export const ThemeProvider: React.FC = ({ children }) => {
  const isDark = useAppState((s) => s.isDark);

  const theme: Theme = {
    ...defaultTheme,
    isDark,
    gridLine: isDark ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY3,
    stroke: isDark ? alpha(Colors.DARK_GRAY3) : alpha(Colors.LIGHT_GRAY1),
    player: isDark ? Colors.LIGHT_GRAY4 : Colors.DARK_GRAY2,
    opponent: isDark ? Colors.DARK_GRAY2 : Colors.GRAY5,
  };

  return (
    <>
      <GlobalStyle />
      <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
    </>
  );
};

export const GlobalStyle = createGlobalStyle`
  body, html, #root {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  #root {
    position: relative;
  }
`;
