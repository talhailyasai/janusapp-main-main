import React from "react";
import "./getstarted.css";
import { Button } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { useOnboarding } from "context/OnboardingContext";

const GetStarted = ({ setStep }) => {
  const { t } = useTranslation();
  const { setCurrentStep, nextStep } = useOnboarding();

  return (
    <>
      <div className="get_started_container">
        <div className="get_started_wrapper">
          <p className="start_janus_head">
            {t("common.pages.welcome_to_janus")}
          </p>

          <p className="start_janus_para">
            {t("common.pages.we_want_you_get_started")}
          </p>
        </div>
      </div>
      <div className="d-flex gap-6 justify-content-center">
        <div className="start_submit_btn_main">
          <Button
            className="start_started_btn"
            onClick={() => nextStep("maintenance")}
          >
            {t("common.pages.Maintenance Plan Guide")}
          </Button>
        </div>
        <div className="start_submit_btn_main">
          <Button className="start_ronder_btn" onClick={() => nextStep()}>
            {t("common.pages.Inspection Plan Guide")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default GetStarted;
