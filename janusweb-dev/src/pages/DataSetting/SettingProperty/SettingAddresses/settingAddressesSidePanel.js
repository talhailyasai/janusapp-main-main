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

const SettingAddressesSidePanel = ({
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

  useEffect(() => {
    setAllBuildings(buildingData);
  }, [buildingData]);

  useEffect(() => {
    setAllProperty(propertyData);
  }, [propertyData]);

  const handleSearchBuilding = (text) => {
    let fBuildings = buildingData?.filter((el) =>
      el?.building_code.includes(text)
    );
    setAllBuildings(fBuildings);
  };

  const handleSearchProperty = (text) => {
    let fBuildings = propertyData?.filter((el) =>
      el?.property_code.includes(text)
    );
    setAllProperty(fBuildings);
  };

  const { t } = useTranslation();

  const handleChange = (e) => {
    setModifyProperty((prev) => ({
      ...prev,
      [e.target.name]: e.target.value?.toUpperCase(),
    }));
  };

  const defaultProps = {
    handleChange: handleChange,
    required: true,
  };

  const selectBuilding = (item) => {
    //debugger;
    defaultProps.handleChange({
      target: { name: "building", value: item.building_code },
    });
    selectProperty(item);
  };

  const selectProperty = (item) => {
    defaultProps.handleChange({
      target: { name: "property", value: item?.property_code?.property_code },
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
            : t("property_page.Add")}
          {t("property_page.address")}
        </SidePanelHeader>
        <SidePanelBody>
          <div className="activity-input-container">
            <Form.Group>
              <Form.Label className="janus_field_label">
                {t("property_page.Street_Address")}
              </Form.Label>
              <Form.Control
                name="address"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.address}
                className="janus_field"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="janus_field_label">
                {t("property_page.Zip_Code")}
              </Form.Label>
              <Form.Control
                name="zipCode"
                type="number"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.zipCode}
                className="janus_field"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="janus_field_label">
                {t("property_page.Postal_address")}
              </Form.Label>
              <Form.Control
                name="postalAddress"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.postalAddress}
                className="janus_field"
              />
            </Form.Group>

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
              disabled={true}
            />
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

export default SettingAddressesSidePanel;
