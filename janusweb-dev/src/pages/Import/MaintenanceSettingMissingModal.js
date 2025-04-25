import { Button, Modal } from "@themesberg/react-bootstrap";
import React from "react";
import { useTranslation } from "react-i18next";

const MaintenanceSettingMissingModal = ({
  missingModalShow,
  setMissingModalShow,
  showSettingModal,
}) => {
  const { t } = useTranslation();

  const handleClose = () => setMissingModalShow(false);
  const handleSubmit = () => {
    showSettingModal();
    handleClose();
  };

  return (
    <Modal
      show={missingModalShow}
      onHide={handleClose}
      animation={false}
      centered
    >
      <Modal.Header className="building_modal_header">
        <Modal.Title className="building_modal_title">
          Maintenance settings missing!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        We see that you have not selected settings for your maintenance plan,
        would you like to create them now?
      </Modal.Body>

      <Modal.Footer className="building_modal_footer">
        <Button className="building_close_btn" onClick={handleClose}>
          {t("common.pages.close")}
        </Button>
        <Button
          className="building_submit_btn setting_create_btn"
          onClick={handleSubmit}
        >
          Create Settings
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MaintenanceSettingMissingModal;
