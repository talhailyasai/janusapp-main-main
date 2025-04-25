import React, { createContext, useContext, useEffect, useState } from "react";

const PlanningContextCheck = createContext();

export const usePlanningContextCheck = () => useContext(PlanningContextCheck);

const PlanningContextCheckProvider = ({ children }) => {
  const [planningChange, setPlanningChange] = useState(undefined);
  const [buildingChange, setBuildingChange] = useState(undefined);
  const [planningProperty, setPlanningProperty] = useState(null);
  const [actvsPerTypePrintData, setActvsPerTypePrintData] = useState(null);
  const [actvsPerYearPrintData, setActvsPerYearPrintData] = useState(null);
  const [actvsPerYearBreakIndexs, setActvsPerYearBreakIndexs] = useState(null);
  const [actvsPerTypeBreakIndexs, setActvsPerTypeBreakIndexs] = useState(null);
  const [reloadCreateEdit, setReloadCreateEdit] = useState(false);
  const [planningGroupsByType, setPlanningGroupsByType] = useState([]);

  const [activeTabMaintenance, setActiveTabMaintenance] =
    useState("create_edit_plan");

  useEffect(() => {
    const previousPlanning = localStorage.getItem("planning_property_code");
    const propertyObj = JSON.parse(localStorage.getItem("planing_property"));
    if (previousPlanning) setPlanningChange(previousPlanning);
    if (propertyObj) setPlanningProperty(propertyObj);
    const activeTabId = localStorage.getItem("activeTabIdPlanningMaintainance");
    if (activeTabId) setActiveTabMaintenance(activeTabId);
  }, []);
  const resetPlanningContext = () => {
    // Reset all states to initial values
    setPlanningChange(undefined);
    setBuildingChange(undefined);
    setPlanningProperty(null);
    setActvsPerTypePrintData(null);
    setActvsPerYearPrintData(null);
    setActvsPerYearBreakIndexs(null);
    setActvsPerTypeBreakIndexs(null);
    setReloadCreateEdit(false);
    setPlanningGroupsByType([]);
    setActiveTabMaintenance("create_edit_plan");

    // Clear related localStorage items
    localStorage.removeItem("planning_property_code");
    localStorage.removeItem("planing_property");
    localStorage.removeItem("planning_building_code");
    localStorage.removeItem("activeTabIdPlanningMaintainance");
  };

  useEffect(() => {
    const previousPlanningBuilding = localStorage.getItem(
      "planning_building_code"
    );
    if (previousPlanningBuilding) setBuildingChange(previousPlanningBuilding);
  }, []);

  return (
    <PlanningContextCheck.Provider
      value={{
        planningChange,
        setPlanningChange,
        buildingChange,
        setBuildingChange,
        activeTabMaintenance,
        setActiveTabMaintenance,
        setPlanningProperty,
        planningProperty,
        reloadCreateEdit,
        setActvsPerTypePrintData,
        setActvsPerYearPrintData,
        actvsPerTypePrintData,
        actvsPerYearPrintData,
        actvsPerYearBreakIndexs,
        setActvsPerYearBreakIndexs,
        actvsPerTypeBreakIndexs,
        setActvsPerTypeBreakIndexs,
        setReloadCreateEdit,
        setPlanningGroupsByType,
        planningGroupsByType,
        resetPlanningContext,
      }}
    >
      {children}
    </PlanningContextCheck.Provider>
  );
};

export default PlanningContextCheckProvider;
