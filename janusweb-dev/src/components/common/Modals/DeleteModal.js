//  import { Modal, ModalBody, ModalFooter, ModalHeader } from "../Modal";
import { Modal, Button } from "@themesberg/react-bootstrap";
import React from "react";
// import "./DeleteModal.css";
import "../../PlanningPage/MaintainancePage/components/Report/ActivitesYear/activitesYear.css";
import { useTranslation } from "react-i18next";

export default function DeleteModal({
  close,
  type,
  handleDelete,
  handleClose,
}) {
  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const { t } = useTranslation();

  return (
    <Modal
      show={true}
      onHide={() => {
        handleClose();
        close();
      }}
      animation={false}
      centered
    >
      <Modal.Header className="modal_delete_maintenanceItem_heading">
        <Modal.Title className="modaldelete_title">
          {t("common.pages.delete")}{" "}
          {capitalizeFirst(type) === "Activity"
            ? t("planning_page.activity")
            : capitalizeFirst(type) === "Component"
            ? t("common.pages.component")
            : capitalizeFirst(type) === "Property"
            ? t("common.pages.Property")
            : t(`${capitalizeFirst(type)}`)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {t("common.pages.delete_confirmation")}{" "}
          {capitalizeFirst(type) === "Activity"
            ? t("planning_page.activites")
            : capitalizeFirst(type) === "Component"
            ? t("planning_page.componentes")
            : capitalizeFirst(type) === "Property"
            ? t("common.pages.Property")
            : t(`${capitalizeFirst(type)}`)}{" "}
          ?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={async () => {
            await handleDelete();
            handleClose();
            close();
            // window.location.reload();
          }}
          className="deletemodal_close_button modal_delete_maintenanceItem_heading"
        >
          {t("planning_page.delete")}
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            handleClose();
            close();
          }}
          className="deletemodal_close_button"
        >
          {t("planning_page.cancel")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
