import { Modal, Button } from "@themesberg/react-bootstrap";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const PropertyMissingModal = ({
  propertyMissingModalShow,
  setPropertyMissingModalShow,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const handleClose = () => setPropertyMissingModalShow(false);
  const handleSubmit = () => {
    history.push("/property");
  };
  return (
    <Modal
      show={propertyMissingModalShow}
      onHide={handleClose}
      animation={false}
      centered
    >
      <Modal.Header className="building_modal_header">
        <Modal.Title className="building_modal_title">
          Properties missing!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Since maintenance items are associated with a property/building you
        should register them first. You can add property/building in the next
        step, but it is done for each row in your plan.
      </Modal.Body>

      <Modal.Footer className="building_modal_footer">
        <Button
          className="building_close_btn property_close_btn"
          onClick={handleClose}
        >
          Continue anyway
        </Button>
        <Button
          className="building_submit_btn setting_create_btn proeprty_setup_btn"
          onClick={handleSubmit}
        >
          Property setup
          <span class="material-symbols-outlined">open_in_new</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PropertyMissingModal;
