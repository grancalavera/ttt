import "@blueprintjs/core/lib/css/blueprint.css";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app/app";
import { AppErrorHandler } from "./app/app-error-handler";
import "./index.scss";

ReactDOM.unstable_createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppErrorHandler>
      <App />
    </AppErrorHandler>
  </React.StrictMode>
);
