import { Colors, FocusStyleManager } from "@blueprintjs/core";
import React from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { createGlobalStyle } from "styled-components/macro";
import { useStore } from "./app-store";

FocusStyleManager.onlyShowFocusOnTabs();

interface Theme {
  boardGridLine: string;
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
  export interface DefaultTheme extends Theme {}
}

export const ThemeProvider: React.FC = ({ children }) => {
  const isDark = useStore((s) => s.isDark);

  const theme: Theme = {
    isDark,
    boardGridLine: isDark ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY3,
    padding,
    contentWidth,
    fullWidth,
    cellWidth,
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
    max-width: 100vw;
    overflow: hidden;
  }
  #root {
    position: relative;
  }
`;
