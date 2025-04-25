import { Button, Form, Modal } from "@themesberg/react-bootstrap";
import api from "api";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PropertyModal = ({ setShow, show, setModalProperty, properties }) => {
  const { t } = useTranslation();
  // const [properties, setProperties] = useState([]);

  const handleClose = () => setShow(false);

  // const getAllProperty = async () => {
  //   try {
  //     let res = await api.get(`/properties//all/unassign`);
  //     setProperties(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getAllProperty();
  // }, []);

  const handleChange = (e) => {
    // console.log(e.target.value);
    // console.log(properties);
    //debugger;
    let selectedProp = properties?.find(
      (elem) => elem?.property_code == e.target.value
    );
    // console.log(
    //   "selectedProp",
    //   selectedProp,
    //   "e.target.value",
    //   e.target.value,
    //   "properties",
    //   properties
    // );
    setModalProperty((prev) => ({
      ...prev,
      property_code: selectedProp?.property_code,
      legal_name: selectedProp?.legal_name,
      property_name: selectedProp?.name,
      propertyId: selectedProp?._id,
      existProperty: true,
    }));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header className="building_modal_header">
        <Modal.Title className="building_modal_title">
          {t("common.pages.select_prop")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label className="maindata_resposible resposible_user">
            {t("common.pages.select_property")}
          </Form.Label>
          <Form.Select
            onChange={handleChange}
            defaultValue={""}
            required={true}
          >
            <option value={""} disabled>
              {t("common.pages.please_select_property")}
            </option>
            {properties?.map((elem) => (
              <option value={elem?.property_code}>
                {elem?.name || elem?.building_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer className="building_modal_footer prop_footer">
        <Button className="building_close_btn" onClick={handleClose}>
          {t("common.pages.close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PropertyModal;
