import api from "api";
import React, { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { usePropertyContextCheck } from "./SidebarContext/PropertyContextCheck";

const OnboardingContext = createContext();

export const steps = [
  "Step 1",
  "Step 2",
  "Step 3",
  "Step 4",
  "Step 5",
  "Step 6",
  "Step 7",
  "Step 8",
  "Step 9",
  "Step 10",
];

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onBoardingState, setOnBoardingState] = useState(false);
  const history = useHistory();
  const [maintenanceSetting, setMaintenanceSetting] = useState(null);
  const [selectedPlanTab, setSelectedPlanTab] = useState(null);
  const [selectedPropertyTab, setSelectedPropertyTab] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [selectedSbaOptions, setSelectedSbaOptions] = useState([]);
  const [plansCode, setPlansCode] = useState([]);
  const [buildingDetails, setBuildingDetails] = useState(null);
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [activeProperty, setActiveProperty] = useState(null);
  const [buildingArray, setBuidlingArray] = useState({
    property_index: 0,
    array: [],
  });
  const [components, setComponents] = useState([]);

  const [showPropertyTable, setShowPropertyTable] = useState(false);
  const [percentage, setPercentage] = useState(null);
  const { setPropertyAdded } = usePropertyContextCheck();

  const getMaintenanceSetting = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      let res = await api.get(`/maintenance_settings/${user._id}`);
      setMaintenanceSetting(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const nextStep = (step) => {
    // console.log("step", step, "currentStep", currentStep);
    if (step === "maintenance") {
      setOnBoardingState(true);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  // Function to reset all states
  const resetOnboarding = () => {
    setCurrentStep(0);
    setOnBoardingState(false);
    setMaintenanceSetting(null);
    setSelectedPlanTab(null);
    setSelectedPropertyTab(null);
    setProperties([]);
    setComponents([]);
    setSelectedComponents([]);
    setSelectedSbaOptions([]);
    setPlansCode([]);
    setBuildingDetails(null);
    setActiveBuilding(null);
    setActiveProperty(null);
    setBuidlingArray({ property_index: 0, array: [] });
    setPercentage(null);
    setShowPropertyTable(false);
  };
  const navigateDashboard = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let res = await api.patch(`/onboarding/change-status/${user?._id}`);
      res?.data?._id && localStorage.setItem("user", JSON.stringify(res.data));
      // console.log("coming in");
      resetOnboarding();
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  const prevStep = (step) => {
    // console.log("step in prev", currentStep, step);

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        nextStep,
        prevStep,
        setCurrentStep,
        navigateDashboard,
        setOnBoardingState,
        onBoardingState,
        setMaintenanceSetting,
        maintenanceSetting,
        getMaintenanceSetting,
        selectedPlanTab,
        setSelectedPlanTab,
        selectedPropertyTab,
        setSelectedPropertyTab,
        properties,
        setProperties,
        selectedComponents,
        setSelectedComponents,
        selectedSbaOptions,
        setSelectedSbaOptions,
        plansCode,
        setPlansCode,
        buildingDetails,
        setBuildingDetails,
        activeBuilding,
        setActiveBuilding,
        activeProperty,
        setActiveProperty,
        buildingArray,
        setBuidlingArray,
        percentage,
        setPercentage,
        resetOnboarding,
        showPropertyTable,
        setShowPropertyTable,
        components,
        setComponents,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
