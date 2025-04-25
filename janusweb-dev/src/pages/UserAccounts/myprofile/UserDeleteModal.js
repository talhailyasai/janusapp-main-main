import React from "react";
import { Modal, Button } from "@themesberg/react-bootstrap";
import api from "api";
import { t } from "i18next";

const UserDeleteModal = ({ show, deleteModalClose, deleteUser }) => {
  return (
    <Modal show={show} onHide={deleteModalClose} animation={false} centered>
      <Modal.Header className="modal_delete_maintenanceItem_heading">
        <Modal.Title className="modaldelete_title">
          {t("common.pages.delete_user")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t("data_settings.Are you sure you want to delete this user?")}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={(e) => {
            e.preventDefault();
            deleteUser();
          }}
          className="deletemodal_close_button modal_delete_maintenanceItem_heading"
        >
          {t("common.pages.delete")}
        </Button>
        <Button
          variant="primary"
          onClick={deleteModalClose}
          className="deletemodal_close_button"
        >
          {t("common.pages.close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDeleteModal;
