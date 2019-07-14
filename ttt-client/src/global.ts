import { createGlobalStyle } from "styled-components";
import "ress";

export const GlobalStyle = createGlobalStyle`
  :root, body {
    font-family: Roboto, sans-serif;
    font-size: 16px;
    line-height: 1rem;
    text-rendering: geometricPrecision;
  }

  body, #root {
    height: 100vh;
    max-width: 100vw;
  }

  button {
    -webkit-appearance: none;
    border-width: 0;
    border-color: transparent;
  }

  button:focus {
    outline: none;
  }

  /* Undo ress.css overflow-y rule
  html {
    overflow-y: initial;
  } */
`;
