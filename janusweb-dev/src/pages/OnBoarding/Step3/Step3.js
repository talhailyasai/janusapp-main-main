import React, { useEffect, useState } from "react";
import "./Step3.css";
import { Button, Col, Row } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import api from "api";
import { useHistory } from "react-router-dom";

const Step3 = ({
  setStep,
  step,
  maintenancePlan,
  setStopStep,
  selectPlan,
  setSelectedMethod,
  selectedMethod,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("user"));
  const [maintenanceSetting, setMaintenanceSetting] = useState(null);

  const getMaintenanceSetting = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      let res = await api.get(`/maintenance_settings/${user._id}`);
      setMaintenanceSetting(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const goToHome = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      let res = await api.patch(`/onboarding/change-status/${user?._id}`);
      res?.data?._id && localStorage.setItem("user", JSON.stringify(res.data));
      history.push("/app");
      setStep(null);
      setStopStep(null);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getMaintenanceSetting();
  }, []);
  const navigatePlan = async () => {
    //debugger;
    console.log("step 3 coming in");
    if (maintenancePlan) {
      setStopStep(null);
      setStep(4);
      console.log("if");
    } else if (user?.role == "user" && maintenanceSetting?.plan_start_year) {
      if (selectedMethod == "work") {
        await goToHome();
      } else {
        setStopStep(null);
        setStep(3);
      }
      console.log("else if");
    } else {
      if (user?.login == true && maintenanceSetting?.plan_start_year) {
        if (selectedMethod == "work") {
          await goToHome();
        } else {
          setStopStep(null);
          setStep(3);
        }
        console.log(
          "coming in step 3 else",
          maintenanceSetting?.plan_start_year
        );
      } else {
        setStopStep("settingMaintenance");
      }
      console.log("else");
    }
  };

  const handleBack = () => {
    if (selectPlan) {
      setStopStep(selectPlan === "wizard" ? "BuildingPage" : "PropertyTable");
    } else {
      setStep(1);
    }
  };
  return (
    <>
      <span
        class="material-symbols-outlined step_arrow_back"
        onClick={handleBack}
      >
        arrow_back
      </span>
      <div className="step3_main">
        <div className="step3_div">
          <p className="step3_head">{t("common.pages.what_do_you")}</p>

          <div>
            {/* Import existing maintenance plan */}
            <Row
              className={`step_import_main ${
                selectedMethod === "import" ? "active_import_div" : ""
              }`}
              onClick={() => {
                setSelectedMethod && setSelectedMethod("import");
              }}
            >
              <Col className="stepimport_icon" xs={2}>
                <span class="material-symbols-outlined import_upload_icon">
                  cloud_upload
                </span>
              </Col>
              <Col xs={10}>
                <p className="step_import_heading">
                  {t("common.pages.import_existing")}
                </p>
                {t("common.pages.if_you_have_existing_plan")}
              </Col>
            </Row>

            {/* Create a new maintenance plan from scratch */}
            <Row
              className={`step_import_main step_maintenance_main ${
                selectedMethod === "create" ? "active_import_div" : ""
              }`}
              onClick={() => {
                setSelectedMethod && setSelectedMethod("create");
              }}
            >
              <Col className="stepimport_icon" xs={2}>
                <span class="material-symbols-outlined step_plus_icon">
                  add_box
                </span>
              </Col>
              <Col xs={10}>
                <p className="step_import_heading">
                  {t("common.pages.create_new_maintenance")}
                </p>
                <div style={{ width: "80%" }}>
                  {t("common.pages.if_you_want_create_plan")}
                </div>
              </Col>
            </Row>
            {/* Work with existing maintenance plan */}
            <Row
              className={`step_import_main ${
                selectedMethod === "work" ? "active_import_div" : ""
              }`}
              onClick={() => {
                setSelectedMethod && setSelectedMethod("work");
              }}
            >
              <Col className="stepimport_icon" xs={2}>
                <span class="material-symbols-outlined step_construc_icon">
                  construction
                </span>
              </Col>
              <Col xs={10}>
                <p className="step_import_heading">
                  {t("common.pages.work_with_existing_maintenance_plan")}
                </p>
                {t("common.pages.if_you_are_a_new_user_of_the_service")}
              </Col>
            </Row>

            <div className="step1_submit_btn_main step2_continue_btn">
              <Button
                className="step1_started_btn"
                onClick={navigatePlan}
                disabled={!selectedMethod ? true : false}
              >
                {t("common.pages.Continue")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step3;
