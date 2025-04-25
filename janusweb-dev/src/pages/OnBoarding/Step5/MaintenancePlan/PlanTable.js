import { Button, Modal } from "@themesberg/react-bootstrap";
import api from "api";
import Import from "pages/Import/Import";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const PlanTable = ({
  setStep,
  setCsvFile,
  csvFile,
  properties,
  step,
  setStopStep,
  setProperties,
}) => {
  const [showMaxBuildingModal, setShowMaxBuildingModal] = useState(false);
  const [maxBuildingMessage, setMaxBuildingMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();
  const { t } = useTranslation();

  const handleCloseMaxProperty = () => {
    setShowMaxBuildingModal(false);
    setMaxBuildingMessage("");
  };

  const handleUpgradePlan = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      (user?.plan === "Standard Plus" ||
        user?.plan === "Standard" ||
        user?.cancelSubscriptionDate) &&
      !user?.trialEnd
    ) {
      let res = await api.get(`/stripe/getCustomerPortal/${user?._id}`);
      window.location = res?.data;
    } else {
      let res = await api.patch(`/onboarding/change-status/${user?._id}`);
      res?.data?._id && localStorage.setItem("user", JSON.stringify(res.data));
      console.log("coming in");
      history.push("/pricing-plan");
    }
  };
  const handleDataSubmit = async (data) => {
    try {
      // console.log("data comoing in handle data", data);
      // return;
      const user = JSON.parse(localStorage.getItem("user"));

      data.isFirstLogin = true;
      let res = await api.post(
        `/onboarding/${user?.role == "user" ? user?.tenantId : user?._id}`,
        data
      );
      if (res?.response?.data?.maxUser) {
        setMaxBuildingMessage(res?.response?.data?.message);
        setShowMaxBuildingModal(true);
        return;
      }
      if (res?.data?._id) {
        localStorage.setItem("user", JSON.stringify(res.data));
        setStopStep(null);
        setStep(5);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {csvFile && (
        <span
          class="material-symbols-outlined step_arrow_back"
          onClick={() => setStopStep("PlanUpload")}
        >
          arrow_back
        </span>
      )}
      <div className="maintenance_main">
        <p className="maintenance_plan_head">
          {t("common.pages.Adjust values where necessary")}
        </p>
        <Import
          setStep={setStep}
          step={step}
          setCsvFile={setCsvFile}
          csvFile={csvFile}
          propertiesData={properties}
          setPropertiesData={setProperties}
          handleDataSubmit={handleDataSubmit}
          setStopStep={setStopStep}
        />
      </div>
      {/* Maximum Buildings Modal  */}
      <Modal
        show={showMaxBuildingModal}
        onHide={handleCloseMaxProperty}
        centered
        className="email_verification_modal_main"
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {maxBuildingMessage}
          {maxBuildingMessage !== "You cannot add more than 50 buildings!" && (
            <div className="update_btn_main">
              {user?.role !== "user" && (
                // <a href="/pricing-plan" target="_blank">
                <Button
                  variant="primary"
                  onClick={handleUpgradePlan}
                  className="update_btn_change_plan mt-2"
                >
                  Upgrade Plan
                </Button>
                // </a>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PlanTable;
