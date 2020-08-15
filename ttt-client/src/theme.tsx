import { Colors, FocusStyleManager } from "@blueprintjs/core";
import React from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { createGlobalStyle } from "styled-components/macro";

import { useAppState } from "./app-state";

FocusStyleManager.onlyShowFocusOnTabs();

export interface Theme {
  accent: string;
  isDark: boolean;
  padding: number;
  cellWidth: number;
  innerWidth: number;
  outerWidth: number;
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
  accent: Colors.DARK_GRAY3,
  isDark: true,
};

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}

export const ThemeProvider: React.FC = ({ children }) => {
  const isDark = useAppState((s) => s.isDark);

  const theme: Theme = {
    ...defaultTheme,
    isDark,
    accent: isDark ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY3,
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
