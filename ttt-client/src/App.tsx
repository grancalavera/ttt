import React from "react";
import { board } from "@grancalavera/ttt-core";

const App: React.FC = () => {
  return <p>{board.join(" | ")}</p>;
};

export default App;
