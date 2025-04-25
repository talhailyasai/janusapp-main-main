import { Form } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";
import Button from "components/common/Button";
import { useTranslation } from "react-i18next";
import InputBoxDropDown from "components/common/InputBoxDropDown";
import { GetAllBuildings } from "lib/BuildingLib";
import { useEffect } from "react";
import { GetAllProperties } from "lib/PropertiesLib";
import api from "api";

const RentalObjectsSidePanel = ({
  handleSubmit,
  close,
  initalVal,
  newTask,
  handleClose,
  copy,
}) => {
  const [modifyProperty, setModifyProperty] = useState(initalVal);

  const { value: buildingData } = GetAllBuildings(undefined, {}, []);

  const { value: propertyData } = GetAllProperties(undefined, {}, []);

  const [allBuildings, setAllBuildings] = useState([]);
  const [allProperty, setAllProperty] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [allAdress, setAllAdress] = useState([]);

  const getAllAdress = async () => {
    try {
      const res = await api.get("/datasetting-addresses");
      setAddressData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAdress();
  }, []);

  useEffect(() => {
    setAllAdress(addressData);
  }, [addressData]);

  useEffect(() => {
    setAllBuildings(buildingData);
  }, [buildingData]);

  useEffect(() => {
    setAllProperty(propertyData);
  }, [propertyData]);

  const handleSearchBuilding = (text) => {
    let fBuildings = buildingData?.filter((el) =>
      el?.building_code?.includes(text)
    );
    setAllBuildings(fBuildings);
  };

  const handleSearchProperty = (text) => {
    let foundData = propertyData?.filter((el) =>
      el?.property_code.includes(text)
    );
    setAllProperty(foundData);
  };

  const handleSearchAddress = (text) => {
    let foundData = addressData?.filter((el) => el?.address.includes(text));
    setAllAdress(foundData);
  };

  const { t } = useTranslation();

  const handleChange = (e) => {
    setModifyProperty((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "objectType"
          ? e.target.value?.toUpperCase()
          : e.target.value,
    }));
  };

  const defaultProps = {
    handleChange: handleChange,
    required: true,
  };

  const selectBuilding = (item) => {
    defaultProps.handleChange({
      target: { name: "building", value: item.building_code },
    });
    selectProperty(item);
  };

  const selectProperty = (item) => {
    if (
      typeof item?.property_code === "number" ||
      typeof item?.property_code === "string"
    ) {
      item = { property_code: item };
    }
    defaultProps.handleChange({
      target: { name: "property", value: item.property_code?.property_code },
    });
  };

  const selectAddress = (item) => {
    defaultProps.handleChange({
      target: { name: "address", value: item.address },
    });
    selectBuilding({
      building_code: item.building,
      property_code: item.property,
    });
  };

  return (
    <Form
      onSubmit={(e) => {
        handleSubmit(e, modifyProperty);
      }}
    >
      <SidePanel>
        <SidePanelHeader>
          {initalVal && !copy
            ? t("common.pages.modify")
            : copy
            ? "Copy "
            : t("property_page.add_rental")}
          {t("property_page.Rental_object")}
        </SidePanelHeader>
        <SidePanelBody>
          <div className="activity-input-container">
            <Form.Group>
              <Form.Label className="janus_field_label">
                {t("property_page.Object_ID")}
              </Form.Label>
              <Form.Control
                name="objectId"
                type="number"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.objectId}
                className="janus_field"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="janus_field_label">
                {t("property_page.Object_type")}
              </Form.Label>
              <Form.Control
                name="objectType"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.objectType}
                className="janus_field"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="janus_field_label">
                {t("property_page.Apartment_no")}
              </Form.Label>
              <Form.Control
                name="apartmentNo"
                type="number"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.apartmentNo}
                className="janus_field"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="janus_field_label">
                {t("property_page.Floor")}
              </Form.Label>
              <Form.Control
                name="floor"
                type="number"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.floor}
                className="janus_field"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="janus_field_label">
                {t("property_page.Rent")}
              </Form.Label>
              <Form.Control
                name="rent"
                type="number"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.rent}
                className="janus_field"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="janus_field_label">
                {t("property_page.Contract_Area")}
              </Form.Label>
              <Form.Control
                name="contractArea"
                type="number"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.contractArea}
                className="janus_field"
              />
            </Form.Group>

            <InputBoxDropDown
              {...defaultProps}
              mdCol={12}
              defaultValue={!initalVal ? "" : initalVal?.address}
              value={modifyProperty?.address}
              text={t("property_page.address")}
              id={"address"}
              handleSubmit={(text) => handleSearchAddress(text)}
              readonly={true}
              result={(handleClose) =>
                allAdress?.map((item) => (
                  <li
                    onClick={() => {
                      selectAddress(item);
                      handleClose();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {item.address}
                  </li>
                ))
              }
            />

            <InputBoxDropDown
              {...defaultProps}
              mdCol={12}
              defaultValue={!initalVal ? "" : initalVal?.building}
              value={modifyProperty?.building}
              text={t("property_page.Building")}
              id={"building"}
              handleSubmit={(text) => handleSearchBuilding(text)}
              result={(handleClose) =>
                allBuildings?.map((item) => (
                  <li
                    onClick={() => {
                      selectBuilding(item);
                      handleClose();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {item.building_code}
                  </li>
                ))
              }
            />
            {/* <Form.Group>
              <Form.Label> Property</Form.Label>
              <Form.Control
                name="property"
                type="number"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.property}
              />
            </Form.Group> */}

            <InputBoxDropDown
              {...defaultProps}
              mdCol={12}
              defaultValue={!initalVal ? "" : initalVal?.property}
              value={modifyProperty?.property}
              text={t("property_page.Property")}
              id={"property"}
              handleSubmit={(text) => handleSearchProperty(text)}
              result={(handleClose) =>
                allProperty?.map((item) => (
                  <li
                    onClick={() => {
                      selectProperty(item);
                      handleClose();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {item?.property_code}
                  </li>
                ))
              }
            />

            <br />
          </div>
        </SidePanelBody>
        <SidePanelFooter>
          <Button main type="submit">
            {t("planning_page.submit")}
          </Button>
          <Button
            secondary
            type="button"
            onClick={() => {
              handleClose();
              close();
            }}
          >
            {t("planning_page.cancel")}
          </Button>
        </SidePanelFooter>
      </SidePanel>
    </Form>
  );
};

export default RentalObjectsSidePanel;
