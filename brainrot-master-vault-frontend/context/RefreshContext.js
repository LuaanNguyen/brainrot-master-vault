import React, { createContext, useState, useContext } from "react";

const RefreshContext = createContext();

export function RefreshProvider({ children }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Call this function to trigger a refresh across components
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <RefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  return useContext(RefreshContext);
}
