import React, { useState } from "react";
import { Modal, Button, Form } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import "../myprofile.css";
import { toast } from "react-toastify";

const DeleteAccountConfirmModal = ({ show, onHide, onConfirmDelete }) => {
  const { t } = useTranslation();
  const [confirmText, setConfirmText] = useState("");
  const requiredText = "DELETE MY ACCOUNT";
  console.log("confirmText !", confirmText, "requiredText", t(requiredText));
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      className="subscription-cancel-modal"
    >
      <Modal.Body
        style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <h5 className="mb-3" style={{ fontWeight: "bold", textAlign: "left" }}>
          {t("delete_account_modal.title", "Confirm Account Deletion")}
        </h5>
        <p className="mb-4" style={{ color: "#555" }}>
          {t(
            "delete_account_modal.message",
            'Deleting your account will permanently remove all your data, including your child users and their data. This action cannot be undone. If you wish to proceed, please type "DELETE MY ACCOUNT" in the field below to confirm.'
          )}
        </p>
        <div className="d-flex justify-content-between w-100">
          <Form.Control
            type="text"
            placeholder={t(
              "delete_account_modal.input_placeholder",
              'Type "DELETE MY ACCOUNT"'
            )}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value?.toUpperCase())}
            className=""
            style={{
              width: "300px",
              padding: "0.25rem, 0.75rem",
            }}
          />

          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmText("");
                onHide();
              }}
              style={{
                padding: "5px 20px",
                borderRadius: "4px",
                cursor: "pointer",
                border: "none",
              }}
            >
              {t("delete_account_modal.cancel_button", "Cancel")}
            </Button>
            <Button
              variant="danger"
              disabled={confirmText !== t(requiredText)}
              onClick={(e) => {
                e.preventDefault();
                if (confirmText !== t(requiredText)) {
                  toast.error(
                    t(
                      "Please type 'DELETE MY ACCOUNT' exactly to confirm deletion"
                    )
                  );
                  return;
                }
                onConfirmDelete();
              }}
              style={{
                border: "none",
                padding: "5px 20px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {t("delete_account_modal.confirm_button")}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteAccountConfirmModal;
