import React from "react";
import "./Step1.css";
import { Button } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";

const Step1 = ({ setStep }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="step1_main">
        <div className="step1">
          <p className="janus_head">{t("common.pages.welcome_to_janus")}</p>

          <p className="janus_para">{t("common.pages.we_want_you_get")}</p>

          <div className="step1_submit_btn_main">
            <Button className="step1_started_btn" onClick={() => setStep(1)}>
              {t("common.pages.get_started")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1;
