import React, { useEffect, useState } from "react";
import "../../../OnBoarding/Step5/Buildings/style.css";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Row } from "@themesberg/react-bootstrap";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import { FaRegCheckCircle } from "react-icons/fa";
import { PiWarningCircle, PiWarningCircleBold } from "react-icons/pi";
import { AiOutlineWarning, AiTwotoneWarning } from "react-icons/ai";
import { calclateBuildingVal } from "utils/helper";
import { t } from "i18next";
import BuuildingSidePanel from "pages/OnBoarding/Step5/Buildings/BuuildingSidePanel";
import { useOnboarding } from "context/OnboardingContext";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
const AddBuildingDetails = () => {
  const { t } = useTranslation();
  const [sidePanel, setSidePanel] = useState(false);
  const [target, setTarget] = useState(null);

  const {
    nextStep,
    properties,
    setProperties,
    selectedPlanTab,
    activeBuilding,
    setActiveBuilding,
    activeProperty,
    setActiveProperty,
    setBuildingDetails,
    buildingDetails,
    buildingArray,
    setBuidlingArray,
    percentage,
    setPercentage,
    selectedPropertyTab,
  } = useOnboarding();
  const { allProperties } = usePropertyContextCheck();
  useEffect(() => {
    if (selectedPropertyTab === 3) {
      // setProperties(allProperties);
      const updatedProperties = allProperties.map((property) => ({
        ...property,
        key: property._id,
        buildingsArray: property.buildingsArray.map((building) => ({
          ...building,
          key: building._id,
        })),
      }));
      setProperties(updatedProperties);
    }
  }, []);

  const handleSubmit = async (e, buildingDetails) => {
    // console.log("submitting", buildingDetails);
    e.preventDefault();
    let result = calclateBuildingVal(buildingDetails);
    // console.log("result submit", result);
    // setPercentage(result);

    const user = JSON.parse(localStorage.getItem("user"));
    let updatedData = properties?.map((el, ind) => {
      if (el?.key === buildingDetails?.propKey) {
        let updatedBuildingsArray = el?.buildingsArray?.map((elem, index) => {
          // console.log(
          //   "elem?.key === buildingDetails?.key",
          //   elem?.key,
          //   buildingDetails?.key
          // );
          if (elem?.key === buildingDetails?.key) {
            setActiveBuilding({
              ...buildingDetails,
              ...result,
            });
            return {
              ...buildingDetails,
              ...result,
            };
          } else {
            return elem;
          }
        });
        return {
          ...el,
          buildingsArray: updatedBuildingsArray,
        };
      } else {
        return el;
      }
    });
    // console.log(updatedData);
    setProperties(updatedData);
    let arr = buildingArray?.array?.map((el) =>
      el?.key == buildingDetails.key ? buildingDetails : el
    );
    // console.log(arr);
    setBuidlingArray({ ...buildingArray, array: arr });
    setSidePanel(false);
  };

  useEffect(() => {
    if (sidePanel) {
      SidePanelService.open(BuuildingSidePanel, {
        handleSubmit,
        initalVal: {
          building_code: activeBuilding?.building_code,
          property_code: activeBuilding?.property_code,
          name: activeBuilding?.name
            ? activeBuilding?.name
            : activeBuilding?.building_name,
          ...activeBuilding,
          propKey: activeBuilding?.propKey,
          buildKey: activeBuilding?.key,
          key: activeBuilding.key,
          target: target,
        },
        handleClose: () => {
          setSidePanel(false);
        },
      });
    }
  }, [sidePanel]);

  const openSidePanel = (propCode, build, propKey, buildKey) => {
    // console.log(build);
    // setBuildingDetails({
    //   propCode,
    //   build,
    //   propKey,
    //   buildKey,
    // });
    let result = calclateBuildingVal(build);
    // setPercentage(result);
    setSidePanel(false);
  };
  // console.log({ activeBuilding });
  const handleChangeProperty = (code) => {
    setActiveBuilding(null);
    setBuildingDetails(null);
    if (code !== "select") {
      properties?.forEach((item, index) => {
        if (code == item?.property_code) {
          setBuidlingArray({
            array: item?.buildingsArray,
            propKey: item?.key,
            property_code: item?.property_code,
          });
          setActiveProperty(item);
        }
      });
    } else {
      setBuidlingArray({ array: [] });
      setActiveProperty(null);
    }
  };

  const handleChangeBuilding = (code) => {
    if (code !== "select") {
      // console.log(code, "calling");
      // console.log(code, "calling");
      buildingArray?.array?.forEach((item, index) => {
        if (code == item?.building_code) {
          let result = calclateBuildingVal(item);
          // console.log("result change", result);
          setActiveBuilding({
            ...item,
            propKey: buildingArray?.propKey,
            property_code: buildingArray?.property_code,
            ...result,
          });
          openSidePanel(
            buildingArray?.property_code,
            item,
            buildingArray?.propKey,
            item?.key
          );
        }
      });
      // });
    } else {
      setBuildingDetails(null);
      setActiveBuilding(null);
    }
  };
  // console.log({ buildingDetails, properties, activeBuilding, activeProperty });
  return (
    <div>
      <div className="select_building_main">
        <div className="step3_div">
          <p className="step3_head">
            {t("common.pages.Select building to create plan")}
          </p>

          <div
            style={{ display: "flex", alignItems: "center", columnGap: "1rem" }}
          >
            <Form.Select
              className="select_building"
              onChange={(e) => handleChangeProperty(e.target.value)}
              value={activeProperty?.property_code}
            >
              <option value={"select"}>{t("common.pages.select_prop")}</option>
              {properties?.map((item, index) => (
                <option value={item?.property_code}>{item?.name}</option>
              ))}
            </Form.Select>
            <Form.Select
              className="select_building"
              onChange={(e) => handleChangeBuilding(e.target.value)}
              value={activeBuilding ? activeBuilding?.building_code : "select"}
            >
              <option value={"select"}>
                {t("common.pages.Select Building")}
              </option>
              {buildingArray?.array?.map((elem, buildIndex) => (
                <option value={elem?.building_code}>
                  {elem?.name || elem?.building_name}
                </option>
              ))}
            </Form.Select>
          </div>

          {activeBuilding && (
            <div>
              {/* Import existing maintenance plan */}
              <Row
                className={`step_import_main`}
                style={{ padding: "22px 0px" }}
                onClick={() => {
                  setTarget("attributes");
                  setSidePanel(true);
                }}
              >
                <Col className="stepimport_icon" xs={2}>
                  {activeBuilding?.att_num > 89 ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#1A9110" }}
                    >
                      check_circle
                    </span>
                  ) : activeBuilding?.att_num > 49 &&
                    activeBuilding?.att_num < 89 ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#FBC70F" }}
                    >
                      error
                    </span>
                  ) : activeBuilding?.att_num < 50 ||
                    !activeBuilding?.att_num ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#DB4437" }}
                    >
                      warning
                    </span>
                  ) : null}
                </Col>
                <Col xs={10}>
                  <p className="step_import_heading">
                    {t("common.pages.Building attributes")}
                  </p>
                </Col>
              </Row>

              {/* Create a new maintenance plan from scratch */}
              <Row
                className={`step_import_main step_maintenance_main`}
                style={{ padding: "22px 0px" }}
                onClick={() => {
                  setTarget("area");
                  setSidePanel(true);
                }}
              >
                <Col className="stepimport_icon" xs={2}>
                  {activeBuilding?.area_num > 89 ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#1A9110" }}
                    >
                      check_circle
                    </span>
                  ) : activeBuilding?.area_num > 49 &&
                    activeBuilding?.area_num < 89 ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#FBC70F" }}
                    >
                      error
                    </span>
                  ) : activeBuilding?.area_num < 50 ||
                    !activeBuilding?.area_num ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#DB4437" }}
                    >
                      warning
                    </span>
                  ) : null}
                </Col>
                <Col xs={10}>
                  <p className="step_import_heading">
                    {t("common.pages.Areas")}
                  </p>
                </Col>
              </Row>
              {/* Work with existing maintenance plan */}
              <Row
                className={`step_import_main`}
                style={{ padding: "22px 0px" }}
                onClick={() => {
                  setTarget("quantity");
                  setSidePanel(true);
                }}
              >
                <Col className="stepimport_icon" xs={2}>
                  {activeBuilding?.qty_num > 89 ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#1A9110" }}
                    >
                      check_circle
                    </span>
                  ) : activeBuilding?.qty_num > 49 &&
                    activeBuilding?.qty_num < 89 ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#FBC70F" }}
                    >
                      error
                    </span>
                  ) : activeBuilding?.qty_num < 50 ||
                    !activeBuilding?.qty_num ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#DB4437" }}
                    >
                      warning
                    </span>
                  ) : null}
                </Col>
                <Col xs={10}>
                  <p className="step_import_heading">
                    {t("common.pages.Other Quantities")}
                  </p>
                </Col>
              </Row>

              <div className="step1_submit_btn_main step2_continue_btn">
                <Button
                  className="step1_started_btn"
                  disabled={!activeBuilding ? true : false}
                  onClick={nextStep}
                >
                  {t("common.pages.Continue")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {sidePanel && <SidePanelRoot />}
    </div>
  );
};

export default AddBuildingDetails;
