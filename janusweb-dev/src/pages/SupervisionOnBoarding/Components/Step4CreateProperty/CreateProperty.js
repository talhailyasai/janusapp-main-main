import { Button, Form, Modal } from "@themesberg/react-bootstrap";
import LimitExceededModal from "components/common/Modals/LimitExceededModal";
import { useOnboarding } from "context/OnboardingContext";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import api from "api";
import { generateRandomString } from "utils/helper";
import { toast } from "react-toastify";

const CreateProperty = () => {
  const { t } = useTranslation();
  const [propertyCount, setPropertyCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");
  const { accountStats, allPropertyCodes } = usePropertyContextCheck();
  const {
    nextStep,
    properties,
    setProperties,
    setActiveProperty,
    setActiveBuilding,
    setBuidlingArray,
  } = useOnboarding();

  const handleAddBuilding = (elem) => {
    const totalBuildingCount = properties.reduce(
      (total, prop) => total + (prop.buildings || 0),
      0
    );
    if (checkExceedLimits(totalBuildingCount + 1, "buildings")) {
      return;
    }
    const updatedData = properties.map((el, ind) => {
      if (el?.key === elem?.key) {
        return { ...el, buildings: (el.buildings || 0) + 1 };
      }
      return el;
    });
    setProperties(updatedData);
  };

  const handleRemoveBuilding = (elem) => {
    const updatedData = properties.map((el, ind) => {
      if (el?.key === elem?.key) {
        return { ...el, buildings: Math.max((el.buildings || 0) - 1, 0) };
      }
      return el;
    });
    setProperties(updatedData);
  };
  const handleRemoveProp = (elem) => {
    const updatedProperties = properties.filter(
      (el, ind) => el?.key !== elem?.key
    );
    setProperties(updatedProperties);
  };
  const handleProperties = (e) => {
    const newPropertyCount = parseInt(e.target.value);
    if (checkExceedLimits(newPropertyCount, "properties")) {
      return;
    }
    setPropertyCount(newPropertyCount);

    if (newPropertyCount < properties.length) {
      // Remove properties from the end if selecting a lower number
      const updatedProperties = properties.slice(0, newPropertyCount);
      setProperties(updatedProperties);
    } else {
      // Add new properties if selecting a higher number
      const additionalProperties = Array.from(
        { length: newPropertyCount - properties.length },
        () => ({
          key: generateRandomString(7),
        })
      );
      setProperties([...properties, ...additionalProperties]);
    }
  };

  const handleChange = (e, elem) => {
    const updatedData = properties.map((el, ind) => {
      if (el?.key === elem?.key) {
        return {
          ...el,
          [e.target.name]: e.target.value?.toUpperCase(),
        };
      }
      return el;
    });
    setProperties(updatedData);
  };

  const checkExceedLimits = (count, type) => {
    let itemCount;
    if (type === "buildings") {
      itemCount = count + accountStats?.data?.buildingCount;
    } else {
      itemCount = count + accountStats?.data?.propertyCount;
    }
    const isLimitExceeded = itemCount > accountStats?.data?.limits?.[type];

    if (isLimitExceeded) {
      setLimitMessage(accountStats?.data?.messages?.[type]);
      setShowLimitModal(true);
      return true;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkExceedLimits(propertyCount, "properties")) {
      return;
    }

    // Check for duplicate property codes
    const duplicateCodes = properties
      .filter((property) =>
        allPropertyCodes?.property_codes?.includes(property.property_code)
      )
      .map((property) => property.property_code);

    // If duplicates found, show them all in one message
    if (duplicateCodes.length > 0) {
      toast.error(
        t("Property with code {{code}} already exists", {
          code: duplicateCodes.join(", "),
        })
      );
      return;
    }

    // If no duplicates found, proceed with the existing logic
    let updatedData = properties?.map((el) => {
      if (el?.buildings) {
        const buildingsObj = [];
        let buildingCounter = 1;
        const skippedCodes = [];

        // Create specified number of buildings
        while (buildingsObj.length < el.buildings) {
          const proposedBuildingCode = `${el.property_code}0${buildingCounter}`;

          // If code doesn't exist in allPropertyCodes.building_codes, use it
          if (
            allPropertyCodes?.building_codes?.includes(proposedBuildingCode)
          ) {
            skippedCodes.push(proposedBuildingCode);
          } else {
            buildingsObj.push({
              building_code: proposedBuildingCode,
              property_code: el.property_code,
              key: generateRandomString(7),
            });
          }
          buildingCounter++;
        }

        // Show info toast if any codes were skipped
        if (skippedCodes.length > 0) {
          toast.info(
            t("Building with code {{code}} already exists", {
              code: skippedCodes.join(", "),
            })
          );
        }

        return {
          ...el,
          buildingsArray: buildingsObj,
        };
      } else {
        return el;
      }
    });
    setProperties(updatedData);

    // console.log(properties);
    setActiveProperty(null);
    setActiveBuilding(null);
    setBuidlingArray({ property_index: 0, array: [] });
    nextStep();
  };

  const handleCloseLimitModal = () => {
    setShowLimitModal(false);
    setLimitMessage("");
  };

  return (
    <div className="property_wizard_main">
      <p className="property_wizard_head">
        {t("common.pages.How many properties do you want to create?")}
      </p>
      <div className="wizard_slect_main">
        <Form.Select
          aria-label="Default select example"
          className="property_wizard_slect"
          onChange={handleProperties}
          value={properties?.length || ""}
        >
          <option disabled value="">
            {t("common.pages.Select no")}
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </Form.Select>
      </div>
      <Form onSubmit={handleSubmit}>
        <div className="all_property_card_main">
          {properties?.map((elem, index) => {
            return (
              <div className="property_card_main" key={elem?.key}>
                <div className="prop_delete_icon_main">
                  <div
                    className="delete_icon_main"
                    onClick={() => handleRemoveProp(elem)}
                  >
                    <span class="material-symbols-outlined">delete</span>
                  </div>
                </div>
                <br /> <br />
                <div className="property_fields_main">
                  {/*  */}
                  <Form.Group className="setting_name property_name_field">
                    <div className="setting_name_div step4_name_label">
                      {/* {t("common.pages.name")} */}
                      Number
                    </div>
                    <Form.Control
                      name="property_code"
                      type="number"
                      required={true}
                      onChange={(e) => handleChange(e, elem)}
                      className="setting_name_field"
                      value={elem?.property_code}
                    />
                  </Form.Group>
                  <Form.Group className="setting_name property_name_field">
                    <div className="setting_name_div step4_name_label">
                      {t("common.pages.legal_name")}
                      {/* Legal Name */}
                    </div>
                    <Form.Control
                      name="legal_name"
                      type="text"
                      required={true}
                      onChange={(e) => handleChange(e, elem)}
                      className="setting_name_field"
                      value={elem?.legal_name}
                    />
                  </Form.Group>
                  <Form.Group className="setting_name property_name_field">
                    <div className="setting_name_div step4_name_label">
                      {t("common.pages.name")}
                      {/* Name */}
                    </div>
                    <Form.Control
                      name="name"
                      type="text"
                      required={true}
                      onChange={(e) => handleChange(e, elem)}
                      className="setting_name_field"
                      value={elem?.name}
                    />
                  </Form.Group>
                  <div className="property_building_main">
                    <p className="building_how_build_head">
                      {t(
                        "common.pages.How many buildings are there on the property?"
                      )}
                    </p>
                    <div className="buildnum_main">
                      <Button
                        className="delete_icon_main building_remove_icon_main"
                        disabled={!elem?.buildings}
                        onClick={() => handleRemoveBuilding(elem)}
                      >
                        <span class="material-symbols-outlined">remove</span>
                      </Button>

                      <div className="property_building_num">
                        {elem?.buildings || (
                          <span class="material-symbols-outlined">remove</span>
                        )}
                      </div>
                      <Button
                        className="delete_icon_main building_remove_icon_main"
                        disabled={elem?.buildings === 5}
                        onClick={() => handleAddBuilding(elem)}
                      >
                        <span class="material-symbols-outlined">add</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="step1_submit_btn_main step_4continue">
          <Button
            className="step1_started_btn"
            main
            type="submit"
            disabled={properties?.length > 0 ? false : true}
          >
            {t("common.pages.Continue")}
          </Button>
        </div>
      </Form>
      <LimitExceededModal
        show={showLimitModal}
        onHide={handleCloseLimitModal}
        message={limitMessage}
      />
    </div>
  );
};

export default CreateProperty;
