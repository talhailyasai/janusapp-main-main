import React from "react";
import { Modal, Button } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

const SignOutModal = ({ show, onHide, onSignOut }) => {
  const { t } = useTranslation();

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body style={{ textAlign: "center" }}>
        <h5 className="mb-3" style={{ fontWeight: "bold" }}>
          {t("sign_out_modal.title")}{" "}
        </h5>
        <p className="mb-4" style={{ color: "#555" }}>
          {t("sign_out_modal.message")}{" "}
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
            onSignOut();
          }}
        >
          {t("sign_out_modal.button")}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default SignOutModal;
