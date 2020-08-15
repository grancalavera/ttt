import { Button } from "@blueprintjs/core";
import { DARK_THEME, LIGHT_THEME, useStore } from "./app-store";
import React, { useEffect, useRef } from "react";
import shallow from "zustand/shallow";

export const ToggleTheme: React.FC = () => {
  const bodyRef = useRef(document.querySelector("body"));
  const [isDark, toggleTheme] = useStore((s) => [s.isDark, s.toggleTheme], shallow);

  useEffect(() => {
    const [add, remove] = isDark ? [DARK_THEME, LIGHT_THEME] : [LIGHT_THEME, DARK_THEME];
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
