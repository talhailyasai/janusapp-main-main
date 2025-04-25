import React from "react";
import PlanningContextCheckProvider from "./PlanningContextCheck";
import PropertyContextCheckProvider from "./PropertyContextCheck";
import UserContextProvider from "./UserContext";

const SidebarContextProvider = ({ children }) => {
  return (
    <UserContextProvider>
      <PropertyContextCheckProvider>
        <PlanningContextCheckProvider>{children}</PlanningContextCheckProvider>
      </PropertyContextCheckProvider>
    </UserContextProvider>
  );
};

export default SidebarContextProvider;
