import React, { useEffect, useState } from "react";
import "../../../OnBoarding/Step3/Step3.css";
import { Button, Col, Row } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import api from "api";
import { useHistory } from "react-router-dom";
import { useOnboarding } from "context/OnboardingContext";
import { ReactComponent as AddIcon } from "../../../../assets/img/note_stack_add.svg";

const Step2PlanMethod = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("user"));
  const {
    setMaintenanceSetting,
    maintenanceSetting,
    getMaintenanceSetting,
    selectedPlanTab,
    setSelectedPlanTab,
    nextStep,
  } = useOnboarding();
  const goToHome = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      let res = await api.patch(`/onboarding/change-status/${user?._id}`);
      res?.data?._id && localStorage.setItem("user", JSON.stringify(res.data));
      history.push("/app");
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getMaintenanceSetting();
  }, []);
  // const navigatePlan = async () => {

  // };

  return (
    <>
      <div className="step3_main">
        <div className="step3_div">
          <p className="step3_head">{t("common.pages.what_do_you")}</p>

          <div>
            <Row
              className={`step_import_main step_maintenance_main ${
                selectedPlanTab === 1 ? "active_import_div" : ""
              }`}
              onClick={() => {
                setSelectedPlanTab(1);
              }}
            >
              <Col className="stepimport_icon" xs={2}>
                <span class="material-symbols-outlined step_plus_icon">
                  add_box
                </span>
              </Col>
              <Col xs={10}>
                <p className="step_import_heading">
                  {t("common.pages.create_new_supervision")}
                </p>
                <div style={{ width: "80%" }}>
                  {t("common.pages.create_supervision_plan")}
                </div>
              </Col>
            </Row>
            {/* Work with existing supervision plan */}
            <Row
              className={`step_import_main ${
                selectedPlanTab === 2 ? "active_import_div" : ""
              }`}
              onClick={() => {
                setSelectedPlanTab(2);
              }}
            >
              <Col className="stepimport_icon" xs={2}>
                <span class="material-symbols-outlined step_construc_icon">
                  <AddIcon className="step_construc_icon" />
                </span>
              </Col>
              <Col xs={10}>
                <p className="step_import_heading">
                  {t("common.pages.supervision_plan_template")}
                </p>
                {t("common.pages.reusable_supervision_package")}
              </Col>
            </Row>

            <div className="step1_submit_btn_main step2_continue_btn">
              <Button
                className="step1_started_btn"
                onClick={nextStep}
                disabled={!selectedPlanTab ? true : false}
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

export default Step2PlanMethod;
