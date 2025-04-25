import { Button, Modal } from "@themesberg/react-bootstrap";
import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ImportDoneModal = ({ doneModal, setDoneModal }) => {
  const { t } = useTranslation();

  const history = useHistory();
  const handleClose = () => setDoneModal(false);

  const handleSubmit = () => {
    localStorage.setItem("activeTabIdPlanningMaintainance", "report");
    history.push(`/maintainence`);
  };

  return (
    <Modal show={doneModal} onHide={handleClose} animation={false} centered>
      <Modal.Header className="building_modal_header">
        <Modal.Title className="building_modal_title">
          {t("common.pages.import_done")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{t("common.pages.you_have_imported")}</Modal.Body>

      <Modal.Footer className="building_modal_footer">
        <Button className="building_close_btn" onClick={handleClose}>
          {t("common.pages.done_close")}
        </Button>
        <Button
          type="submit"
          className="building_submit_btn"
          onClick={handleSubmit}
        >
          {t("common.pages.go_plan")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportDoneModal;
