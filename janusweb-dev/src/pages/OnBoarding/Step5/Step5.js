import React, { useState } from "react";
import { Button, Col, Row } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import "./Step5.css";
const Step5 = ({ setStep, step, setStopStep, setSelectPlan }) => {
  const [activeMethod, setActiveMethod] = useState(null);
  const { t } = useTranslation();

  const SelectMethod = (method) => {
    setSelectPlan(method);
    setActiveMethod(method);
  };

  const handleBack = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role == "user") {
      setStep(2);
    } else {
      if (user?.login == true) {
        setStep(2);
      } else setStopStep("settingMaintenance");
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
          <p className="step3_head">
            {t("common.pages.Properties and buildings")}
          </p>

          <div className="step5_maintenance_para">
            {t(
              "common.pages.The items in the maintenance plan are linked to a property and a building. We need to create these now. Choose the way you prefer."
            )}
          </div>
          <div>
            {/* Create Properties Via Wizard */}
            <Row
              className={`step_import_main ${
                activeMethod === "wizard" ? "active_import_div" : ""
              }`}
              onClick={() => SelectMethod("wizard")}
            >
              <Col className="stepimport_icon" xs={2}>
                <span class="material-symbols-outlined property_direction_icon">
                  assistant_direction
                </span>
              </Col>

              <Col xs={10}>
                <p className="step_import_heading">
                  {t("common.pages.Create properties via wizard")}
                </p>
                {t(
                  "common.pages.The wizard helps you in a structured way to create properties and buildings based on your data."
                )}
              </Col>
            </Row>

            {/* Create properties from file import */}
            <Row
              className={`step_import_main step_maintenance_main ${
                activeMethod === "import" ? "active_import_div" : ""
              }`}
              onClick={() => SelectMethod("import")}
            >
              <Col className="stepimport_icon" xs={2}>
                <span class="material-symbols-outlined property_direction_icon csv_icon">
                  csv
                </span>
              </Col>
              <Col xs={10}>
                <p className="step_import_heading">
                  {t("common.pages.Create properties from file import")}
                </p>
                {t(
                  "common.pages.If you have a file in CSV or Excel format that is set up in the specified way, you can select this option."
                )}
              </Col>
            </Row>
            {/* I already have properties and building*/}
            <Row
              className={`step_import_main ${
                activeMethod === "already" ? "active_import_div" : ""
              }`}
              onClick={() => SelectMethod("already")}
            >
              <Col className="stepimport_icon" xs={2}>
                <span class="material-symbols-outlined property_direction_icon home_icon">
                  home_work
                </span>
              </Col>
              <Col xs={10}>
                <p className="step_import_heading">
                  {t("common.pages.I already have properties and buildings")}
                </p>
                {t(
                  "common.pages.If you have already created properties and buildings, you can create maintenance plans directly on them."
                )}
              </Col>
            </Row>

            <div className="step1_submit_btn_main step2_continue_btn step_4continue">
              <Button
                className="step1_started_btn"
                onClick={
                  () =>
                    activeMethod === "wizard"
                      ? setStopStep("propertyWizard")
                      : activeMethod === "import"
                      ? setStopStep("PropertyImport")
                      : setStopStep("selectBuilding")
                  // setStep(12)
                }
                disabled={!activeMethod ? true : false}
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

export default Step5;
