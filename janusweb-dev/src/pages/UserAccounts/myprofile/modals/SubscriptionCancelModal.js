import React from "react";
import { Modal, Button } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import "../myprofile.css"

const SubscriptionCancelModal = ({ show, onHide, onGoToSubscription }) => {
  const { t } = useTranslation();

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      className="subscription-cancel-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: "bold" }}>
          {t("subscription_cancel_modal.title", "Subscription Cancellation Required")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: "center" }}>
        <p className="mb-4" style={{ color: "#555" }}>
          {t("subscription_cancel_modal.message", 
            "Before deleting your account, you must first cancel your active subscription. Please go to your subscription settings and cancel it. Once the subscription is canceled, you can proceed with account deletion.")}
        </p>
        <Button
          variant="warning"
          style={{
            backgroundColor: "#f3a847",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
          }}
          onClick={(e) => {
            e.preventDefault();
            onGoToSubscription();
          }}
        >
          {t("subscription_cancel_modal.button", "Go to Subscription Settings")}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default SubscriptionCancelModal;