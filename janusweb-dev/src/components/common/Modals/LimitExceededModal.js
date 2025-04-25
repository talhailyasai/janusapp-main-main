import React from "react";
import { Modal, Button } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import api from "api";
import { useHistory } from "react-router-dom";

const LimitExceededModal = ({
  show,
  onHide,
  message,
  showUpgradeButton = true,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleUpgradePlan = async () => {
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

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="email_verification_modal_main"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("limit_exceed_modal.Change Plan")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t(`limit_exceed_modal.${message}`)}
        {showUpgradeButton &&
          message !== "You cannot add more than 50 buildings!" && (
            <div className="update_btn_main">
              {user?.role !== "user" && (
                <Button
                  variant="primary"
                  onClick={handleUpgradePlan}
                  className="update_btn_change_plan mt-2"
                >
                  {t("limit_exceed_modal.Upgrade Plan")}
                </Button>
              )}
            </div>
          )}
      </Modal.Body>
    </Modal>
  );
};

export default LimitExceededModal;
