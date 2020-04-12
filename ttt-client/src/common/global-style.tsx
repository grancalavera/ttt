import { FocusStyleManager } from "@blueprintjs/core";
import { createGlobalStyle } from "styled-components/macro";

FocusStyleManager.onlyShowFocusOnTabs();

export const GlobalStyle = createGlobalStyle`
  body, html, #root {
    height: 100vh;
    max-width: 100vw;
    overflow: hidden;
  }
   #root {
    display: grid;
  }
`;
