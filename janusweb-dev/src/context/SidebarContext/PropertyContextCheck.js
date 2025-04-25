import {
  GetAccountStats,
  GetAllProperties,
  GetAllPropertyCodes,
} from "lib/PropertiesLib";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import api from "api";

const PropertyContextCheck = createContext();

export const usePropertyContextCheck = () => useContext(PropertyContextCheck);

const PropertyContextCheckProvider = ({ children }) => {
  const { user, userToken, setUser } = useUserContext();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [propertyChange, setPropertyChange] = useState(undefined);
  const [property, setProperty] = useState(null);

  const [buildingChange, setBuildingChange] = useState(undefined);
  const [buildingObj, setBuildingObj] = useState(null);
  const [compObj, setCompObj] = useState(null);

  const [componentChange, setComponentChange] = useState(undefined);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [buildings, setBuildings] = useState(undefined);
  const [propertyAdded, setPropertyAdded] = useState({});
  const [buildingAdded, setBuildingAdded] = useState({});
  const [componentAdded, setComponentAdded] = useState({});
  const [activityAdded, setActivityAdded] = useState({});
  const [componentMessage, setComponentMessage] = useState(null);
  const [currentTab, setCurrentTab] = useState(null);

  const { value: allProperties } = GetAllProperties(
    {},
    [propertyAdded, buildingAdded, componentAdded, token],
    undefined,
    user?.plan === "Standard Plus" || user?.canceledPlan === "Standard Plus"
      ? 50
      : undefined
  );
  const { value: allPropertyCodes } = GetAllPropertyCodes({}, [
    token,
    propertyAdded,
    buildingAdded,
  ]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const [isPropertyBarCollapsed, setIsPropertyBarCollapsed] = useState(true);
  const togglePropertyBarCollapse = () => {
    setIsPropertyBarCollapsed(!isPropertyBarCollapsed);
  };
  const { value: accountStats } = GetAccountStats({}, [
    propertyAdded,
    token,
    buildingAdded,
    componentAdded,
  ]);
  // console.log({ accountStats });
  // useEffect(() => {
  //   if (!isCollapsed) {
  //     setIsPropertyBarCollapsed(true);
  //   }
  // }, [isCollapsed]);
  // useEffect(() => {
  //   if (!isPropertyBarCollapsed) {
  //     setIsCollapsed(true);
  //   }
  // }, [isPropertyBarCollapsed]);
  // Reset function
  const resetPropertyContext = () => {
    setUser(null);
    setToken(null);
    setPropertyChange(undefined);
    setProperty(null);
    setBuildingChange(undefined);
    setBuildingObj(null);
    setCompObj(null);
    setComponentChange(undefined);
    setSelectedUser(undefined);
    setBuildings(undefined);
    setPropertyAdded({});
    setBuildingAdded({});
    setComponentAdded({});
    setActivityAdded({});
    setComponentMessage(null);
    setCurrentTab(null);
  };

  useEffect(() => {
    const previousProperty = localStorage.getItem("property");
    const propertyObj = JSON.parse(localStorage.getItem("propertyObj"));
    if (previousProperty) setPropertyChange(previousProperty);
    if (propertyObj) setProperty(propertyObj);
    const previousComponent = localStorage.getItem("component");
    const compObj = JSON.parse(localStorage.getItem("compObj"));

    if (previousComponent) setComponentChange(previousComponent);
    if (compObj) setCompObj(compObj);
    const previousBuilding = localStorage.getItem("building");
    const buildingObj = JSON.parse(localStorage.getItem("buildingObj"));
    if (previousBuilding) setBuildingChange(previousBuilding);
    if (buildingObj) setBuildingObj(buildingObj);
  }, []);

  const [resize, setResize] = useState(0);
  const [windowDimension, setWindowDimension] = useState(null);
  const [settingsFormData, setSettingsFormData] = useState(null);
  const getMaintencanceSettings = async (id) => {
    const res = await api.get(`/maintenance_settings/${id}`);
    setSettingsFormData(res?.data);
  };
  const getWindowSize = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return width;
  };
  useEffect(() => {
    let u = JSON.parse(localStorage.getItem("user"));
    if (u && u != "undefined") getMaintencanceSettings(u?._id);
  }, [token]);
  useEffect(() => {
    const handleResize = () => {
      const width = getWindowSize();
      setWindowDimension(width);
      setResize((prev) => prev + 1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  console.log({ windowDimension });

  return (
    <PropertyContextCheck.Provider
      value={{
        propertyChange,
        setPropertyChange,
        buildingChange,
        setBuildingChange,
        componentChange,
        setComponentChange,
        selectedUser,
        setSelectedUser,
        buildings,
        setBuildings,
        setProperty,
        property,
        setBuildingObj,
        buildingObj,
        setCompObj,
        compObj,
        propertyAdded,
        setPropertyAdded,
        buildingAdded,
        setBuildingAdded,
        setComponentAdded,
        componentAdded,
        setActivityAdded,
        activityAdded,
        allProperties,
        setComponentMessage,
        componentMessage,
        setToken,
        isCollapsed,
        setIsCollapsed,
        toggleCollapse,
        isPropertyBarCollapsed,
        setIsPropertyBarCollapsed,
        togglePropertyBarCollapse,
        getWindowSize,
        resize,
        windowDimension,
        setCurrentTab,
        currentTab,
        accountStats,
        setSettingsFormData,
        settingsFormData,
        resetPropertyContext,
        allPropertyCodes,
      }}
    >
      {children}
    </PropertyContextCheck.Provider>
  );
};

export default PropertyContextCheckProvider;
