//  import { Modal, ModalBody, ModalFooter, ModalHeader } from "../Modal";
import { Modal, Button } from "@themesberg/react-bootstrap";
import React from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

export default function CustomModal({
  title,
  body,
  handleOk,
  setOpen,
  open,
  okText,
  cancelText,
  size,
  theme,
}) {
  return (
    <Modal show={open} animation={false} centered size={size && size}>
      <Modal.Header
        className={theme == "light" ? "custom_modal_text" : "custom_modal"}
      >
        <Modal.Title
          className={
            theme == "light" ? "modal_title_light" : "modal_title_dark"
          }
        >
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "600px", overflowY: "scroll" }}>
        <div>{body}</div>
      </Modal.Body>
      <Modal.Footer className="confirmation_modal_footer">
        <Button variant="light" onClick={() => setOpen(false)}>
          {cancelText}
        </Button>
        <Button
          onClick={() => {
            handleOk();
          }}
          variant="primary"
        >
          {okText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
