import { Button } from "@blueprintjs/core";
import { darkTheme, lightTheme, useAppState } from "./app-state";
import React, { useEffect, useRef } from "react";
import shallow from "zustand/shallow";

export const ToggleTheme: React.FC = () => {
  const bodyRef = useRef(document.querySelector("body"));
  const [isDark, toggleTheme] = useAppState((s) => [s.isDark, s.toggleTheme], shallow);

  useEffect(() => {
    const [add, remove] = isDark ? [darkTheme, lightTheme] : [lightTheme, darkTheme];
    bodyRef.current?.classList.add(add);
    bodyRef.current?.classList.remove(remove);
  }, [isDark]);

  return (
    <Button
      style={{ position: "absolute", top: "10px", left: "10px" }}
      onClick={toggleTheme}
      minimal
      icon={isDark ? "flash" : "moon"}
    ></Button>
  );
};
