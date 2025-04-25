import { Button, Form, Modal } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import api from "api";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import LimitExceededModal from "components/common/Modals/LimitExceededModal";
import { toast } from "react-toastify";

const PropertyWizard = ({
  setStep,
  setProperties,
  properties,
  setStopStep,
}) => {
  const { t } = useTranslation();
  const [showMaxBuildingModal, setShowMaxBuildingModal] = useState(false);
  const [maxBuildingMessage, setMaxBuildingMessage] = useState("");
  const [exceedBuildingLimit, setExceedBuildingLimit] = useState(false);
  const [exceedPropertyLimit, setExceedPropertyLimit] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const { accountStats, allPropertyCodes } = usePropertyContextCheck();

  // Add these states
  const [currentPropertyCount, setCurrentPropertyCount] = useState(0);
  const [currentBuildingCount, setCurrentBuildingCount] = useState(0);

  // Common function to check limits
  const checkExceedLimits = (propertyCount, buildingCount, hideModal) => {
    const totalProperties = propertyCount + accountStats?.data?.propertyCount;
    const totalBuildings = buildingCount + accountStats?.data?.buildingCount;

    const isPropertyExceeded =
      totalProperties > accountStats?.data?.limits?.properties;
    const isBuildingExceeded =
      totalBuildings > accountStats?.data?.limits?.buildings;
    // console.log(
    //   "accountStats totalProperties",
    //   totalProperties,
    //   "propertyCount",
    //   propertyCount,
    //   "totalBuildings",
    //   totalBuildings,
    //   "buildingCount",
    //   buildingCount
    // );
    if (isPropertyExceeded) {
      if (!hideModal) {
        setShowMaxBuildingModal(true);
      }
      setMaxBuildingMessage(accountStats?.data?.messages?.properties);
      setExceedPropertyLimit(true);
      return true;
    }

    if (isBuildingExceeded) {
      if (!hideModal) {
        setShowMaxBuildingModal(true);
      }
      setMaxBuildingMessage(accountStats?.data?.messages?.buildings);
      setExceedBuildingLimit(true);
      return true;
    }

    setExceedPropertyLimit(false);
    setExceedBuildingLimit(false);
    return false;
  };

  // Initialize counts in useEffect
  useEffect(() => {
    if (properties?.length) {
      const initialBuildingCount = properties.reduce(
        (total, property) => total + (property?.buildings || 0),
        0
      );
      // console.log(
      //   "properties use accountStats",
      //   "initialBuildingCount",
      //   initialBuildingCount,
      //   "propertiescount",
      //   properties.length
      // );
      setCurrentPropertyCount(properties.length);
      setCurrentBuildingCount(initialBuildingCount);
      checkExceedLimits(properties.length, initialBuildingCount);
    }
  }, []);

  const handleCloseMaxProperty = () => {
    setShowMaxBuildingModal(false);
    setMaxBuildingMessage("");
  };

  const handleProperties = (e) => {
    const newPropertyCount = parseInt(e.target.value);
    if (!checkExceedLimits(newPropertyCount, currentBuildingCount)) {
      setCurrentPropertyCount(newPropertyCount);

      // Preserve existing properties and add empty objects only for new ones
      setProperties((prevProperties) => {
        const existingLength = prevProperties.length;
        console.log("prevProperties in wizard select", prevProperties);
        if (newPropertyCount > existingLength) {
          // Add new empty objects while keeping existing properties
          return [
            ...prevProperties,
            ...Array.from(
              { length: newPropertyCount - existingLength },
              () => ({})
            ),
          ];
        } else if (newPropertyCount < existingLength) {
          // Reduce the array to the new count
          return prevProperties.slice(0, newPropertyCount);
        }

        return prevProperties;
      });
    }
  };

  const handleChange = (e, index) => {
    let updatedData = properties?.map((el, ind) => {
      if (ind === index) {
        return {
          ...el,
          [e.target.name]: e.target.value?.toUpperCase(),
          tenantId: user?._id,
        };
      } else {
        return el;
      }
    });
    setProperties(updatedData);
  };

  const handleAddBuilding = (propIndex) => {
    const newBuildingCount = currentBuildingCount + 1;
    if (!checkExceedLimits(currentPropertyCount, newBuildingCount)) {
      setCurrentBuildingCount(newBuildingCount);
      let updatedData = properties?.map((el, ind) => {
        if (ind === propIndex) {
          return { ...el, buildings: (el?.buildings || 0) + 1 };
        }
        return el;
      });
      setProperties(updatedData);
    }
  };
  const handleRemoveBuilding = (propIndex) => {
    const newBuildingCount = currentBuildingCount - 1;
    setCurrentBuildingCount(newBuildingCount);
    checkExceedLimits(currentPropertyCount, newBuildingCount, true);
    let updatedData = properties?.map((el, ind) => {
      if (ind === propIndex) {
        return {
          ...el,
          buildings: (el?.buildings || 1) - 1,
        };
      } else {
        return el;
      }
    });
    setProperties(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (exceedBuildingLimit || exceedPropertyLimit) {
      setShowMaxBuildingModal(true);
      setMaxBuildingMessage(
        exceedPropertyLimit
          ? accountStats?.data?.messages?.properties
          : accountStats?.data?.messages?.buildings
      );
      return;
    }

    // Check for duplicate property codes
    const duplicateCodes = properties
      .filter(
        (property) =>
          allPropertyCodes?.property_codes?.some(
            (code) => code == property.property_code
          ) // Using loose comparison
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
    // console.log("properties in wizard", properties);
    let updatedData = properties?.map((el) => {
      if (el?.buildings) {
        const buildingsObj = [];
        let buildingCounter = 1;
        const skippedCodes = [];

        // Create specified number of buildings
        while (buildingsObj.length < el.buildings) {
          const proposedBuildingCode = `${el.property_code}0${buildingCounter}`;

          // Check if building code already exists
          if (
            allPropertyCodes?.building_codes?.some(
              (code) => code == proposedBuildingCode
            )
          ) {
            skippedCodes.push(proposedBuildingCode);
          } else {
            buildingsObj.push({
              building_code: proposedBuildingCode,
              property_code: el.property_code,
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
    //debugger;
    // setStep(6);
    setStopStep("BuildingPage");
  };

  const handleRemoveProp = (propIndex, pro) => {
    //debugger;
    const newPropertyCount = currentPropertyCount - 1;
    const removedBuildings = properties[propIndex]?.buildings || 0;
    const newBuildingCount = currentBuildingCount - removedBuildings;

    setCurrentPropertyCount(newPropertyCount);
    setCurrentBuildingCount(newBuildingCount);
    checkExceedLimits(newPropertyCount, newBuildingCount, true);

    let newData = [];
    for (let i = 0; i < properties.length; i++) {
      if (properties[i]?.property_code !== pro?.property_code) {
        newData.push(properties[i]);
      }
    }
    // console.log(newData);
    setProperties(newData);
    //debugger;
    // let newData = properties.filter((elem, index) => {
    //   return elem?.property_code !== pro?.property_code;
    // });

    // setProperties(newData);
    // setProperties([
    //   { property_code: "dfd" },
    //   { property_code: "dfd565" },
    //   { property_code: "dfd898" },
    // ]);
  };
  const handleBack = () => {
    setStopStep(null);
    setStep(3);
  };

  return (
    <>
      <span
        class="material-symbols-outlined step_arrow_back"
        onClick={handleBack}
      >
        arrow_back
      </span>
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
                <div className="property_card_main" key={index}>
                  <div className="prop_delete_icon_main">
                    <div
                      className="delete_icon_main"
                      onClick={() => handleRemoveProp(index, elem)}
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
                        onChange={(e) => handleChange(e, index)}
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
                        onChange={(e) => handleChange(e, index)}
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
                        onChange={(e) => handleChange(e, index)}
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
                        >
                          <span
                            class="material-symbols-outlined"
                            onClick={() => handleRemoveBuilding(index)}
                          >
                            remove
                          </span>
                        </Button>

                        <div className="property_building_num">
                          {elem?.buildings || (
                            <span class="material-symbols-outlined">
                              remove
                            </span>
                          )}
                        </div>
                        <Button
                          className="delete_icon_main building_remove_icon_main"
                          disabled={elem?.buildings === 5}
                        >
                          <span
                            class="material-symbols-outlined"
                            onClick={() => handleAddBuilding(index)}
                          >
                            add
                          </span>
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
        {/*  */}
      </div>
      {/* Maximum Buildings Modal  */}
      <LimitExceededModal
        show={showMaxBuildingModal}
        onHide={handleCloseMaxProperty}
        message={maxBuildingMessage}
      />
    </>
  );
};

export default PropertyWizard;
