import React, { createContext } from "react";
import SidebarContextProvider from "./SidebarContext";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  return (
    <AppContext.Provider value={{}}>
      <SidebarContextProvider>{children}</SidebarContextProvider>
    </AppContext.Provider>
  );
};

export default AppContextProvider;
