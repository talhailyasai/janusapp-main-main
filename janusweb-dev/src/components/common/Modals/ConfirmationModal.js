//  import { Modal, ModalBody, ModalFooter, ModalHeader } from "../Modal";
import { Modal, Button } from "@themesberg/react-bootstrap";
import React from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

export default function ConfirmationModal({
  title,
  body,
  handleOk,
  setOpen,
  open,
  okText,
  cancelText,
}) {
  return (
    <Modal show={open} animation={false} centered>
      <Modal.Header className="confirmation_modal">
        <Modal.Title className="modaldelete_title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{body}</div>
      </Modal.Body>
      <Modal.Footer className="confirmation_modal_footer">
        <Button
          onClick={() => {
            handleOk();
          }}
          variant="light"
          className="confirmation_modal_btn"
        >
          {okText}
        </Button>
        <Button variant="primary" onClick={() => setOpen(false)}>
          {cancelText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
