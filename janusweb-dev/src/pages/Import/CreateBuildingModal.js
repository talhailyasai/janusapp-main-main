import { Button, Form, Modal } from "@themesberg/react-bootstrap";
import api from "api";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PropertyModal from "./PropertyModal";

const CreateBuildingModal = ({
  buildingModal,
  setBuildingModal,
  buildings,
  setBuildings,
  rowIndex,
  handleSelectBuilding,
  setRowIndex,
  properties,
  setProperties,
  setPropCreated,
  setPropertiesData,
  propertiesData,
  setDupProperties,
}) => {
  const [modalProperty, setModalProperty] = useState(null);
  const [generateValues, setGenerateValues] = useState(false);
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (generateValues) {
      handleChange();
    }
  }, [generateValues]);

  const handleClose = () => {
    setModalProperty(null);
    setGenerateValues(false);
    setRowIndex(null);
    setBuildingModal(false);
  };

  const handleChange = (e) => {
    if (generateValues) {
      const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
      let buildCode = randomNum.toString() + "01";
      setModalProperty((prev) => ({
        ...prev,
        property_code: randomNum,
        building_code: buildCode,
      }));
      setGenerateValues(false);
    } else {
      setModalProperty((prev) => ({
        ...prev,
        [e.target.name]: e.target.value?.toUpperCase(),
      }));
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      let res;
      // console.log("modalProperty", modalProperty);
      if (!modalProperty?.existProperty || !modalProperty?.propertyId) {
        let propData = {
          property_code: modalProperty?.property_code,
          legal_name: modalProperty?.legal_name,
          name: modalProperty?.property_name,
        };

        res = await api.post("/properties", propData);
        // Replace the property in the array by matching property_code
        if (modalProperty?.existProperty) {
          const updatedProperties = properties?.map((prop) =>
            prop.property_code == modalProperty?.property_code
              ? res?.data
              : prop
          );
          setProperties(updatedProperties);
          setDupProperties(updatedProperties);
        } else {
          setProperties([...properties, res?.data]);
          setDupProperties([...properties, res?.data]);
        }
      }

      if (res?.response?.data?.message) {
        return toast(`${res?.response?.data?.message}`, {
          type: "error",
        });
      } else {
        let buildData = {
          property_code: !modalProperty?.propertyId
            ? res?.data?._id
            : modalProperty?.propertyId,
          building_code: modalProperty?.building_code,
          name: modalProperty?.building_name,
        };
        let data = await api.post("/buildings", buildData);
        setBuildings([...buildings, data?.data]);

        // console.log("rowIndex", rowIndex);
        await handleSelectBuilding(data?.data, null, rowIndex);
        setTimeout(() => {
          handleClose();
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showPropModal = () => setShow(true);
  return (
    <>
      <Modal
        show={buildingModal}
        onHide={handleClose}
        animation={false}
        centered
      >
        <Modal.Header className="building_modal_header">
          <Modal.Title className="building_modal_title">
            {t("common.pages.create_prop_build")}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Button
              className="import_data_btn import_generate_value"
              onClick={() => setGenerateValues(true)}
            >
              <span class="material-symbols-outlined">variable_insert</span>

              {t("common.pages.generate_values")}
            </Button>
            <p className="select_property_head" onClick={showPropModal}>
              {t("common.pages.my_prop")}
            </p>
            <div className="create_building_form_main">
              <Form.Group>
                <Form.Label>{t("common.pages.prop_num")}</Form.Label>
                <Form.Control
                  name="property_code"
                  type="number"
                  required={true}
                  onChange={handleChange}
                  value={modalProperty?.property_code}
                />
              </Form.Group>

              <Form.Group className="create_building_field">
                <Form.Label>{t("common.pages.legal_name")}</Form.Label>
                <Form.Control
                  name="legal_name"
                  type="text"
                  required={true}
                  onChange={handleChange}
                  value={modalProperty?.legal_name}
                />
              </Form.Group>
              <Form.Group className="create_building_field">
                <Form.Label>{t("common.pages.prop_name")}</Form.Label>
                <Form.Control
                  name="property_name"
                  type="text"
                  required={true}
                  onChange={handleChange}
                  value={modalProperty?.property_name}
                />
              </Form.Group>
              <Form.Group className="create_building_field">
                <Form.Label>{t("common.pages.build_num")}</Form.Label>
                <Form.Control
                  name="building_code"
                  type="number"
                  onChange={handleChange}
                  value={modalProperty?.building_code}
                  required
                />
              </Form.Group>
              <Form.Group className="create_building_field">
                <Form.Label>{t("common.pages.build_name")}</Form.Label>
                <Form.Control
                  name="building_name"
                  type="text"
                  onChange={handleChange}
                  value={modalProperty?.building_name}
                  required
                />
              </Form.Group>
            </div>
          </Modal.Body>

          <Modal.Footer className="building_modal_footer">
            <Button className="building_close_btn" onClick={handleClose}>
              {t("common.pages.close")}
            </Button>
            <Button type="submit" className="building_submit_btn">
              {t("common.pages.Submit")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* // Property Modal */}
      <PropertyModal
        setShow={setShow}
        show={show}
        setModalProperty={setModalProperty}
        properties={properties}
      />
    </>
  );
};

export default CreateBuildingModal;
