import React, { useState } from "react";
import { Button, Col, Row } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import "../../../OnBoarding/Step5/Step5.css";
import { useOnboarding } from "context/OnboardingContext";
const SelectPropertyTabs = () => {
  const { t } = useTranslation();
  const {
    nextStep,
    selectedPropertyTab,
    setSelectedPropertyTab,
    setProperties,
    setActiveProperty,
    setActiveBuilding,
    setBuidlingArray,
  } = useOnboarding();
  const [previousSelectedTab, setPReviousSelectedTab] =
    useState(selectedPropertyTab);
  const SelectMethod = (method) => {
    setSelectedPropertyTab(method);
  };
  console.log(
    "previousSelectedTab",
    previousSelectedTab,
    "selectedPropertyTab",
    selectedPropertyTab
  );
  const handleTabChange = () => {
    if (
      (previousSelectedTab === 2 || previousSelectedTab === 3) &&
      selectedPropertyTab === 1
    ) {
      setProperties([]);
      return;
    }

    if (selectedPropertyTab === 3) {
      setActiveProperty(null);
      setActiveBuilding(null);
      setBuidlingArray({ property_index: 0, array: [] });
    }
  };
  return (
    <>
      <div className="step3_main">
        <div className="step3_div">
          <p className="step3_head">
            {t("common.pages.Properties and buildings")}
          </p>

          <div className="step5_maintenance_para">
            {t("common.pages.components_linked_to_property")}
          </div>
          <div>
            {/* Create Properties Via Wizard */}
            <Row
              className={`step_import_main ${
                selectedPropertyTab === 1 ? "active_import_div" : ""
              }`}
              onClick={() => SelectMethod(1)}
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
                selectedPropertyTab === 2 ? "active_import_div" : ""
              }`}
              onClick={() => SelectMethod(2)}
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
                selectedPropertyTab === 3 ? "active_import_div" : ""
              }`}
              onClick={() => SelectMethod(3)}
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
                onClick={() => {
                  handleTabChange();
                  nextStep();
                }}
                disabled={!selectedPropertyTab ? true : false}
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

export default SelectPropertyTabs;
