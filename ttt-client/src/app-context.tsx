import React, { useState } from "react";

export interface Context {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const AppContext = React.createContext<Context>({
  isLoading: false,
  setIsLoading: () => {},
});

export const TTTApp: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </AppContext.Provider>
  );
};
