import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import GetStarted from "./Components/Step0/GetStarted";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { Dropdown, Nav } from "@themesberg/react-bootstrap";
import { useOnboarding } from "../../context/OnboardingContext";
import ConfirmationModal from "components/common/Modals/ConfirmationModal";
import OnBoarding from "pages/OnBoarding/OnBoarding";
import Step1Videos from "./Components/Step1Videos/Step1Videos";
import Step2PlanMethod from "./Components/Step2PlanMethod/Step2PlanMethod";
import CreateProperty from "./Components/Step4CreateProperty/CreateProperty";
import SelectPropertyTabs from "./Components/Step3PropertyMethod/SelectPropertyTabs";
import "./Components/supervisionOnboarding.css";
import BuildingNamesForm from "./Components/Step5BuildingDetail/BuildingNamesForm";
import AddBuildingDetails from "./Components/Step5BuildingDetail/AddBuildingDetails";
import PlanImage from "./Components/PlanImage/PlanImage";
import PlanTable from "./Components/PlanTable/PlanTable";
import FinalStepsDone from "./Components/FinalStepsDone/FinalStepsDone";
import PropertyImport from "./Components/PropertyImport/PropertyImport";
import OnBoardingComponentPackages from "./Components/CreatePackages/OnBoardingComponentPackages";

const steps = ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"];

let languageOptions = [
  {
    lang: "English",
    key: "en",
  },
  {
    lang: "Swedish",
    key: "sv",
  },
];

const SuperVisionOnboardingPage = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const {
    currentStep,
    prevStep,
    navigateDashboard,
    onBoardingState,
    selectedPlanTab,
    selectedPropertyTab,
    setSelectedPropertyTab,
  } = useOnboarding();
  const getMarginClass = (step) => {
    switch (step) {
      case 0:
        return "my-6";
      case 1:
        return "my-2";
      case 2:
        return "mt-3";
      default:
        return "my-3"; // Default margin
    }
  };
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
  const getStepNumber = (currentStep) => {
    if (selectedPropertyTab === 1) {
      if (currentStep <= 3) return currentStep; // Steps 0-3 remain the same
      if (currentStep >= 4 && currentStep <= 7) return 3; // Steps 4-7 map to step 3
      if (currentStep === 8) return 4; // Step 8 maps to step 4
      if (currentStep >= 9) return 5; // Step 10 maps to step 5
    }
    if (selectedPropertyTab === 3 || selectedPropertyTab === 2) {
      if (currentStep <= 3) return currentStep; // Steps 0-3 remain the same
      if (currentStep >= 4 && currentStep <= 5) return 3; // Steps 4-7 map to step 3
      if (currentStep === 6) return 4; // Step 8 maps to step 4
      if (currentStep >= 7) return 5; // Step 10 maps to step 5
    }
    return currentStep; // Default fallback
  };

  const getComponentForStep = () => {
    // Common step 0 and 1
    if (currentStep === 0) return <GetStarted />;
    if (currentStep === 1) return <Step1Videos />;
    if (currentStep === 2) return <Step2PlanMethod />;

    // Steps for plan tabs and property tabs
    const isSelectedPlanTab1 = selectedPlanTab === 1;
    const isSelectedPlanTab2 = selectedPlanTab === 2;
    const isSelectedPropertyTab1 = selectedPropertyTab === 1;
    const isSelectedPropertyTab2 = selectedPropertyTab === 2;
    const isSelectedPropertyTab3 = selectedPropertyTab === 3;

    if (isSelectedPlanTab1) {
      if (currentStep === 3) return <SelectPropertyTabs />;
      if (currentStep === 4 && isSelectedPropertyTab1)
        return <CreateProperty />;
      if (currentStep === 5 && isSelectedPropertyTab1)
        return <BuildingNamesForm />;
      if (currentStep === 6 && isSelectedPropertyTab1)
        return <AddBuildingDetails />;
      if (currentStep === 7 && isSelectedPropertyTab1) return <PlanImage />;
      if (currentStep === 8 && isSelectedPropertyTab1) return <PlanTable />;
      if (currentStep === 9 && isSelectedPropertyTab1)
        return <FinalStepsDone />;

      if (isSelectedPropertyTab3) {
        if (currentStep === 4) return <AddBuildingDetails />;
        if (currentStep === 5) return <PlanImage />;
        if (currentStep === 6) return <PlanTable />;
        if (currentStep === 7) return <FinalStepsDone />;
      }

      if (isSelectedPropertyTab2) {
        if (currentStep === 4) return <PropertyImport />;
        if (currentStep === 5) return <PlanImage />;
        if (currentStep === 6) return <PlanTable />;
        if (currentStep === 7) return <FinalStepsDone />;
      }
    }

    if (isSelectedPlanTab2) {
      if (currentStep === 3) return <SelectPropertyTabs />;
      if (currentStep === 4 && isSelectedPropertyTab1)
        return <CreateProperty />;
      if (currentStep === 5 && isSelectedPropertyTab1)
        return <BuildingNamesForm />;
      if (currentStep === 6 && isSelectedPropertyTab1)
        return <AddBuildingDetails />;
      if (currentStep === 7 && isSelectedPropertyTab1)
        return <OnBoardingComponentPackages />;
      if (currentStep === 8 && isSelectedPropertyTab1) return <PlanTable />;
      if (currentStep === 9 && isSelectedPropertyTab1)
        return <FinalStepsDone />;

      if (isSelectedPropertyTab3) {
        if (currentStep === 4) return <AddBuildingDetails />;
        if (currentStep === 5) return <OnBoardingComponentPackages />;
        if (currentStep === 6) return <PlanTable />;
        if (currentStep === 7) return <FinalStepsDone />;
      }

      if (isSelectedPropertyTab2) {
        if (currentStep === 4) return <PropertyImport />;
        if (currentStep === 5) return <OnBoardingComponentPackages />;
        if (currentStep === 6) return <PlanTable />;
        if (currentStep === 7) return <FinalStepsDone />;
      }
    }

    return null;
  };

  console.log({
    selectedPropertyTab,
    currentStep,
    "getStepNumber(currentStep)": getStepNumber(currentStep),
  });
  return (
    <>
      {onBoardingState ? (
        <OnBoarding skipStep={true} />
      ) : (
        <div
          className="supervision_onBoarding d-flex flex-column align-items-center relative"
          style={{
            background: "white",
            height: "100vh",
            color: "black",
            overflowY: "auto",
          }}
        >
          <div className="d-flex justify-content-between align-items-center w-100">
            <span
              class={`material-symbols-outlined step_arrow_back ms-4 ${
                getStepNumber(currentStep) === 5 ? "pe-none opacity-0" : ""
              }`}
              onClick={prevStep}
              style={{ margin: "1.5rem 0rem" }}
            >
              arrow_back
            </span>
            <div className="d-flex align-items-center my-4">
              {/* {steps.map((step, index) => (
                <div key={index} className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 30,
                      height: 30,
                      border: "2px solid #2C3E50",
                      backgroundColor:
                        index < currentStep ? "#2C3E50" : "white",
                    }}
                  >
                    {index < currentStep ? (
                      <span
                        style={{
                          color: "white",
                          fontSize: 12,
                        }}
                      >
                        <svg
                          width="18"
                          height="13"
                          viewBox="0 0 18 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.54961 12.9996L0.849609 7.29961L2.27461 5.87461L6.54961 10.1496L15.7246 0.974609L17.1496 2.39961L6.54961 12.9996Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          background:
                            index === currentStep ? "#2C3E50" : "white",
                          borderRadius: "100%",
                        }}
                      ></span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      style={{
                        width: 50,
                        height: 2,
                        backgroundColor: "#2C3E50",
                      }}
                    ></div>
                  )}
                </div>
              ))} */}
              {steps.map((step, index) => (
                <div key={index} className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 30,
                      height: 30,
                      border: "2px solid #2C3E50",
                      backgroundColor:
                        index < getStepNumber(currentStep)
                          ? "#2C3E50"
                          : "white",
                    }}
                  >
                    {index < getStepNumber(currentStep) ? (
                      <span style={{ color: "white", fontSize: 12 }}>
                        <svg
                          width="18"
                          height="13"
                          viewBox="0 0 18 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.54961 12.9996L0.849609 7.29961L2.27461 5.87461L6.54961 10.1496L15.7246 0.974609L17.1496 2.39961L6.54961 12.9996Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          background:
                            index === getStepNumber(currentStep)
                              ? "#2C3E50"
                              : "white",
                          borderRadius: "100%",
                        }}
                      ></span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      style={{
                        width: 50,
                        height: 2,
                        backgroundColor: "#2C3E50",
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="end-0 d-flex gap-3 me-4">
              <span
                class="material-symbols-outlined step_cross_icon"
                onClick={() => setOpen(true)}
                style={{ margin: "1.5rem 0rem" }}
              >
                close
              </span>
              <Dropdown
                as={Nav.Item}
                className="signin_language_dropdown"
                style={{ margin: "1.5rem 0rem" }}
              >
                <Dropdown.Toggle as={Nav.Link} className="p-0">
                  <div className="media d-flex align-items-center">
                    <span
                      class="material-symbols-outlined text-black"
                      style={{ fontSize: "1.5rem" }}
                    >
                      language
                    </span>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                  {languageOptions?.map((elem) => {
                    return (
                      <Dropdown.Item
                        onClick={() => i18n.changeLanguage(elem.key)}
                        key={elem}
                      >
                        {elem?.lang}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className={`${getMarginClass(currentStep)} w-100`}>
            {getComponentForStep()}
          </div>

          {/* <OnBoardingComponentPackages /> */}
          <ConfirmationModal
            handleOk={navigateDashboard}
            open={open}
            setOpen={setOpen}
            title={t("common.pages.Quit onboarding?")}
            body={t(
              "common.pages.If you quit onboarding, none of the data that was entered will be saved - quit anyway?"
            )}
            okText={t("common.pages.Yes, quit")}
            cancelText={t("common.pages.No, continue")}
          />
        </div>
      )}
    </>
  );
};

export default SuperVisionOnboardingPage;
