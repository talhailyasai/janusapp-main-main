import React, { useEffect, useState } from "react";
import Stepper from "react-stepper-horizontal";
import Step1 from "./Step1/Step1";
import Step2 from "./Step2/Step2";
import Step3 from "./Step3/Step3";
import Step4 from "./Step4/Step4";
import Step5 from "./Step5/Step5";
import { Dropdown, Nav, Modal, Button } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import PropertyWizard from "./Step5/PropertyWizard";
import BuildingsPage from "./Step5/Buildings/BuildingsPage";
import MaintenancePlan from "./Step5/MaintenancePlan/MaintenancePlan";
import SelectPlan from "./Step5/SelectPlan";
import PlanUpload from "./Step5/MaintenancePlan/PlanUpload";
import PlanTable from "./Step5/MaintenancePlan/PlanTable";
import StepsDone from "./Step5/StepsDone";
import PropertyImport from "./Step5/PropertyImport/PropertyImport";
import PropertyTable from "./Step5/PropertyImport/PropertyTable";
import SelectBuilding from "./Step5/Buildings/SelectBuilding";
import PlanCover from "./Step5/planCover/index";
import StepperDot from "../../assets/img/pages/stepper_dot.png";
import stepper_check from "../../assets/img/pages/stepper_check.png";
import greyImg from "../../assets/img/pages/grey.PNG";
import CoverPlanTable from "./Step5/planCover/table";
import api from "api";
import { useHistory } from "react-router-dom";
import my_plans from "../../utils/articales.json";
import ConfirmationModal from "../../components/common/Modals/ConfirmationModal";
import { t } from "i18next";
import { SupervisionOnboardingWrapper } from "pages/SupervisionOnBoarding/SupervisionOnboardingWrapper";
const OnBoarding = ({ skipStep }) => {
  const [mandatory, setMandatory] = useState({
    basic: false,
    navigation: false,
  });
  const history = useHistory();
  const [step, setStep] = useState(0);
  const [stopStep, setStopStep] = useState(null);
  const [selectPlan, setSelectPlan] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [open, setOpen] = useState(false);

  const [properties, setProperties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const { i18n } = useTranslation();
  const [existProperty, setExistProperty] = useState(null);
  const [showReloadModal, setShowReloadModal] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
  useEffect(() => {
    if (skipStep) {
      setStep(1);
    }
  }, [skipStep]);
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
  const handleIcon = (stp) => {
    if (stp == step) {
      return StepperDot;
    } else if (step > stp) {
      return stepper_check;
    } else {
      return greyImg;
    }
  };

  const navigateDashboard = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let res = await api.patch(`/onboarding/change-status/${user?._id}`);
      res?.data?._id && localStorage.setItem("user", JSON.stringify(res.data));
      console.log("coming in");
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (Array.isArray(properties) && properties.length > 0) {
      const hasValidBuildingsArray = properties.every((prop) =>
        Array.isArray(prop?.buildingsArray)
      );

      if (hasValidBuildingsArray) {
        let arr = [];
        properties.forEach((elem) => {
          if (Array.isArray(elem?.buildingsArray)) {
            arr = [...arr, ...elem.buildingsArray];
          }
        });
        // console.log("arr in obaording", arr);
        setBuildings(arr);
      }
    }
  }, [properties]);

  useEffect(() => {
    if (selectPlan == "already") {
      getProperties();
    }
  }, [selectPlan]);

  const getProperties = async () => {
    try {
      let res = await api.get(`/properties`);
      setProperties(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (selectedBuilding) {
  //     let arr = plans?.map((el) => {
  //       return {
  //         ...el,
  //         building_code: selectedBuilding?.building_code,
  //         property_code: selectedBuilding?.property_code,
  //       };
  //     });
  //     setPlans(arr);
  //   }
  // }, [plans]);

  return step === 0 && skipStep ? (
    <SupervisionOnboardingWrapper />
  ) : (
    <div className="on_boarding_main">
      {/* Dropdown Change Language */}
      <div>
        <span
          class="material-symbols-outlined step_cross_icon pt-1"
          onClick={() => setOpen(true)}
          style={{ margin: "1rem 1rem 1.5rem 0rem" }}
        >
          close
        </span>
        <Dropdown as={Nav.Item} className="signin_language_dropdown">
          <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
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
      <div className="step1_submit_btn_main">
        <div className="onboarding_stepper">
          <Stepper
            // activeColor="rgb(224, 224, 224)"
            activeColor="#333F50"
            completeColor="#333F50"
            // defaultColor="#FFFFFF"
            // defaultBorderColor="#333F50"
            // completeBorderColor="#333F50"
            // activeBorderColor="#333F50"
            steps={[
              {
                title: "",
                icon: handleIcon(0),
              },
              {
                title: "",
                // icon: step > 1 ? stepper_check : StepperDot,
                icon: handleIcon(1),
              },
              {
                title: "",
                icon: handleIcon(2),
                // icon: step > 2 ? stepper_check : StepperDot,
              },
              {
                title: "",
                icon: handleIcon(3),
              },
              {
                title: "",
                icon: handleIcon(4),
              },
            ]}
            activeStep={step - 1}
          />
        </div>
      </div>

      {stopStep === "settingMaintenance" ? (
        <Step4 setStep={setStep} step={step} setStopStep={setStopStep} />
      ) : stopStep === "propertyWizard" ? (
        <PropertyWizard
          setStep={setStep}
          step={step}
          setProperties={setProperties}
          properties={properties}
          setStopStep={setStopStep}
        />
      ) : stopStep === "BuildingPage" ? (
        <BuildingsPage
          setStep={setStep}
          step={step}
          setProperties={setProperties}
          properties={properties}
          setStopStep={setStopStep}
          selectedMethod={selectedMethod}
        />
      ) : stopStep === "planCard" ? (
        <SelectPlan
          setStep={setStep}
          step={step}
          properties={properties}
          setStopStep={setStopStep}
          selectPlan={selectPlan}
        />
      ) : stopStep === "PlanUpload" ? (
        <PlanUpload
          setStep={setStep}
          step={step}
          setCsvFile={setCsvFile}
          setStopStep={setStopStep}
        />
      ) : stopStep === "PlanTable" ? (
        <PlanTable
          setStep={setStep}
          step={step}
          setCsvFile={setCsvFile}
          csvFile={csvFile}
          properties={properties}
          setProperties={setProperties}
          setStopStep={setStopStep}
        />
      ) : stopStep === "PropertyImport" ? (
        <PropertyImport
          setStep={setStep}
          step={step}
          setProperties={setProperties}
          setStopStep={setStopStep}
          setCsvFile={setCsvFile}
        />
      ) : stopStep === "PropertyTable" ? (
        <PropertyTable
          setStep={setStep}
          step={step}
          setProperties={setProperties}
          properties={properties}
          setStopStep={setStopStep}
        />
      ) : stopStep === "selectBuilding" ? (
        <SelectBuilding
          properties={properties}
          selectedBuilding={selectedBuilding}
          setSelectedBuilding={setSelectedBuilding}
          buildings={buildings}
          setStopStep={setStopStep}
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          setStep={setStep}
          setProperties={setProperties}
          csvFile={csvFile}
          selectPlan={selectPlan}
        />
      ) : stopStep === "planCover" ? (
        <PlanCover
          setPlans={setPlans}
          plans={plans}
          setStopStep={setStopStep}
          building={selectedBuilding}
          setStep={setStep}
        />
      ) : stopStep === "coverPlanTable" ? (
        <>
          {plans?.length > 0 && (
            <CoverPlanTable
              setPlans={setPlans}
              plans={plans}
              setStopStep={setStopStep}
              building={selectedBuilding}
              setStep={setStep}
              properties={properties}
              existProperty={existProperty}
              setExistProperty={setExistProperty}
              selectPlan={selectPlan}
            />
          )}
        </>
      ) : step === 0 ? (
        <Step1 setStep={setStep} step={step} />
      ) : step === 1 ? (
        <Step2
          setStep={setStep}
          step={step}
          mandatory={mandatory}
          setMandatory={setMandatory}
        />
      ) : step === 2 ? (
        <Step3
          setStep={setStep}
          step={step}
          setStopStep={setStopStep}
          setSelectedMethod={setSelectedMethod}
          selectedMethod={selectedMethod}
        />
      ) : step === 3 ? (
        <Step5
          setStep={setStep}
          step={step}
          setStopStep={setStopStep}
          setSelectPlan={setSelectPlan}
        />
      ) : step === 4 ? (
        <MaintenancePlan
          setStep={setStep}
          step={step}
          setStopStep={setStopStep}
        />
      ) : step === 5 ? (
        <StepsDone
          setStopStep={setStopStep}
          selectedMethod={selectedMethod}
          setStep={setStep}
        />
      ) : null}
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
  );
};

export default OnBoarding;
