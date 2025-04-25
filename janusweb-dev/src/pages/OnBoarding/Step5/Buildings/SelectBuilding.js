import React, { useEffect, useState } from "react";
import "./style.css";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Row } from "@themesberg/react-bootstrap";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import BuuildingSidePanel from "./BuuildingSidePanel";
import { FaRegCheckCircle } from "react-icons/fa";
import { PiWarningCircle, PiWarningCircleBold } from "react-icons/pi";
import { AiOutlineWarning, AiTwotoneWarning } from "react-icons/ai";
import { calclateBuildingVal } from "utils/helper";
import { t } from "i18next";
const SelectBuilding = ({
  step,
  setStopStep,
  buildings,
  activeMethod,
  properties,
  selectedBuilding,
  setSelectedBuilding,
  selectedMethod,
  setStep,
  setProperties,
  csvFile,
  selectPlan,
}) => {
  const { t } = useTranslation();
  const [buildingDetails, setBuildingDetails] = useState(null);
  const [buildingArray, setBuidlingArray] = useState({
    property_index: 0,
    array: [],
  });
  const [percentage, setPercentage] = useState(null);
  const [target, setTarget] = useState(null);
  const [sidePanel, setSidePanel] = useState(false);
  const [state, setState] = useState(null);
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [activeProperty, setActiveProperty] = useState(null);

  const handleNext = () => {
    if (selectedMethod == "create") setStopStep("planCover");
    else {
      setStep(4);
      setStopStep("no");
    }
  };

  const handleBack = () => {
    console.log(csvFile);
    if (selectPlan == "already") {
      setStopStep(null);
      setProperties([]);
      setStep(3);
    } else {
      if (csvFile) {
        setStopStep("PropertyTable");
      } else setStopStep("BuildingPage");
    }
  };

  const handleSubmit = async (e, buildigDetail) => {
    console.log("submitting", buildigDetail);
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    let updatedData = properties?.map((el, ind) => {
      if (ind === buildigDetail?.propIndex) {
        let updatedBuildingsArray = el?.buildingsArray?.map((elem, index) => {
          if (index === buildigDetail?.buildIndex) {
            return {
              ...buildigDetail,
              tenantId: user?._id,
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
    console.log(updatedData);
    setProperties(updatedData);
    let arr = buildingArray?.array?.map((el) =>
      el?.tenantId == buildigDetail.tenantId ? buildigDetail : el
    );
    console.log(arr);
    setBuidlingArray({ ...buildingArray, array: arr });
  };

  useEffect(() => {
    if (state) {
      console.log(state);
      handleChangeBuilding(state?.build?.building_code);
    }
    if (properties.length == 1) {
      console.log(properties);
      handleChangeProperty(properties[0]?.property_code);
    }
  }, []);

  useEffect(() => {
    if (state) {
      // console.log(state);
      handleChangeBuilding(state?.build?.building_code);
    }
  }, [properties]);

  useEffect(() => {
    if (sidePanel) {
      SidePanelService.open(BuuildingSidePanel, {
        handleSubmit,
        initalVal: {
          building_code: buildingDetails?.build?.building_code,
          property_code: buildingDetails?.propCode,
          name: buildingDetails?.build?.name
            ? buildingDetails?.build?.name
            : buildingDetails?.build?.building_name,
          ...buildingDetails?.build,
          propIndex: buildingDetails?.propIndex,
          buildIndex: buildingDetails?.buildIndex,
          target: target,
        },
        handleClose: () => {
          //   setBuildingDetails({});
          setSidePanel(false);
        },
      });
    }
  }, [sidePanel]);

  const openSidePanel = (propCode, build, propIndex, buildIndex) => {
    setBuildingDetails({
      propCode,
      build,
      propIndex,
      buildIndex,
    });
    let result = calclateBuildingVal(build);
    setSelectedBuilding({
      propCode,
      build,
      propIndex,
      buildIndex,
      building_name: build?.building_name,
    });
    setPercentage(result);
    setSidePanel(false);
    // if (state) setSidePanel(true);
  };

  const handleChangeProperty = (code) => {
    if (code !== "select") {
      console.log(properties);
      properties?.map((item, index) => {
        // item?.buildingsArray?.map((elem, buildIndex) => {
        if (code == item?.property_code) {
          setBuidlingArray({
            array: item?.buildingsArray,
            property_index: index,
          });
          setActiveProperty(code);
          // setBuildingDetails(null);
          setActiveBuilding(t("common.pages.Select Building"));
          // setState({
          //   propCode: item.property_code,
          //   build: elem,
          //   propIndex: index,
          //   buildIndex: buildIndex,
          // });
          // openSidePanel(item?.property_code, elem, index, buildIndex);
        }
      });
      // });
    } else {
      setBuildingDetails(null);
      setBuidlingArray({ array: [], property_index: 0 });
      setActiveBuilding(t("common.pages.Select Building"));
    }
  };

  const handleChangeBuilding = (code) => {
    if (code !== "select") {
      // console.log(code, "calling");
      setActiveBuilding(code);
      buildingArray?.array?.map((item, index) => {
        // console.log(code, item);
        // item?.buildingsArray?.map((elem, buildIndex) => {
        if (code == item?.building_code) {
          // console.log("match");
          setState({
            propCode: code,
            build: item,
            propIndex: buildingArray?.property_index,
            buildIndex: index,
          });
          openSidePanel(
            item?.property_code,
            item,
            buildingArray?.property_index,
            index
          );
        }
      });
      // });
    } else {
      setBuildingDetails(null);
      setActiveBuilding(t("common.pages.Select Building"));
    }
  };

  return (
    <div>
      <span
        class="material-symbols-outlined step_arrow_back"
        onClick={handleBack}
      >
        arrow_back
      </span>
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
              value={activeProperty}
            >
              <option value={"select"}>{t("common.pages.select_prop")}</option>
              {properties?.map((item, index) => (
                <option value={item?.property_code}>{item?.name}</option>
              ))}
            </Form.Select>
            <Form.Select
              className="select_building"
              onChange={(e) => handleChangeBuilding(e.target.value)}
              value={activeBuilding}
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

          {buildingDetails && (
            <div>
              {/* Import existing maintenance plan */}
              <Row
                className={`step_import_main ${
                  activeMethod === "import" ? "active_import_div" : ""
                }`}
                style={{ padding: "22px 0px" }}
                onClick={() => {
                  setTarget("attributes");
                  setSidePanel(true);
                }}
              >
                <Col className="stepimport_icon" xs={2}>
                  {percentage?.att_num > 89 ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#1A9110" }}
                    >
                      check_circle
                    </span>
                  ) : percentage?.att_num > 49 && percentage?.att_num < 89 ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#FBC70F" }}
                    >
                      error
                    </span>
                  ) : percentage?.att_num < 50 ? (
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
                className={`step_import_main step_maintenance_main ${
                  activeMethod === "create" ? "active_import_div" : ""
                }`}
                style={{ padding: "22px 0px" }}
                onClick={() => {
                  setTarget("area");
                  setSidePanel(true);
                }}
              >
                <Col className="stepimport_icon" xs={2}>
                  {percentage?.area_num > 89 ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#1A9110" }}
                    >
                      check_circle
                    </span>
                  ) : percentage?.area_num > 49 && percentage?.area_num < 89 ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#FBC70F" }}
                    >
                      error
                    </span>
                  ) : percentage?.area_num < 50 ? (
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
                className={`step_import_main ${
                  activeMethod === "work" ? "active_import_div" : ""
                }`}
                style={{ padding: "22px 0px" }}
                onClick={() => {
                  setTarget("quantity");
                  setSidePanel(true);
                }}
              >
                <Col className="stepimport_icon" xs={2}>
                  {percentage?.qty_num > 89 ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#1A9110" }}
                    >
                      check_circle
                    </span>
                  ) : percentage?.qty_num > 49 && percentage?.qty_num < 89 ? (
                    <span
                      class="material-symbols-outlined"
                      style={{ fontSize: "34px", color: "#FBC70F" }}
                    >
                      error
                    </span>
                  ) : percentage?.qty_num < 50 ? (
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
                  disabled={!buildingDetails ? true : false}
                  onClick={handleNext}
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

export default SelectBuilding;
