import React, { useState } from "react";

export interface Context {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export const AppContext = React.createContext<Context>({
  loading: false,
  setLoading: () => {},
});

export const TTTApp: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider value={{ loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};
