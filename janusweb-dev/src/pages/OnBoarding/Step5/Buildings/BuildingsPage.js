import React, { useState } from "react";
import "./Buildings.css";
import {
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
} from "@themesberg/react-bootstrap";
import BuuildingSidePanel from "./BuuildingSidePanel";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { toast } from "react-toastify";

const BuildingsPage = ({
  properties,
  setProperties,
  setStep,
  step,
  setStopStep,
  selectedMethod,
}) => {
  const [sidePanel, setSidePanel] = useState(false);
  const [builingDetails, setBuilingDetails] = useState({});
  const { t } = useTranslation();

  const handleChange = (e, propIndex, buildIndex) => {
    const user = JSON.parse(localStorage.getItem("user"));

    let updatedData = properties?.map((el, ind) => {
      if (ind === propIndex) {
        let updatedBuildingsArray = el?.buildingsArray?.map((elem, index) => {
          if (index === buildIndex) {
            return {
              ...elem,
              [e.target.name]: e.target.value?.toUpperCase(),
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

    setProperties(updatedData);
  };

  const handleSubmit = async (e, buildigDetail) => {
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

    console.log(updatedData, "updatedData");

    setProperties(updatedData);
    setSidePanel(false);
  };

  const openSidePanel = (propCode, build, propIndex, buildIndex) => {
    console.log(build);
    setBuilingDetails({
      propCode,
      build,
      propIndex,
      buildIndex,
    });
    setSidePanel(true);
  };

  const handleNext = () => {
    let isEmptyBuildName = false;
    properties?.map((prop) => {
      prop?.buildingsArray?.map((build) => {
        if (!build?.name || build?.name === "") {
          isEmptyBuildName = true;
        }
      });
    });
    if (isEmptyBuildName) {
      return toast.error("Please enter building name!");
    }
    // setStep(7);
    if (selectedMethod == "create") setStopStep("selectBuilding");
    else {
      setStep(4);
      setStopStep("no");
    }
  };

  useEffect(() => {
    if (sidePanel) {
      SidePanelService.open(BuuildingSidePanel, {
        handleSubmit,
        initalVal: {
          building_code: builingDetails?.build?.building_code,
          property_code: builingDetails?.propCode,
          name: builingDetails?.build?.name
            ? builingDetails?.build?.name
            : builingDetails?.build?.building_name,
          ...builingDetails?.build,
          propIndex: builingDetails?.propIndex,
          buildIndex: builingDetails?.buildIndex,
        },
        handleClose: () => {
          setBuilingDetails({});
          setSidePanel(false);
        },
      });
    }
  }, [sidePanel]);

  return (
    <>
      <span
        class="material-symbols-outlined step_arrow_back"
        onClick={() => setStopStep("propertyWizard")}
      >
        arrow_back
      </span>
      <div className="stepper_build_page">
        <p className="building_page_head">
          {t("common.pages.Enter the name of each building and its properties")}
        </p>
        <div className="buildingsPage_main">
          {properties?.map((el, index) => {
            return (
              <div>
                <div className="buildings_main">
                  <div className="buildings_header">
                    <div>
                      <OverlayTrigger
                        placement={"top"}
                        overlay={<Tooltip> {el?.property_code}</Tooltip>}
                      >
                        <Button className="build_tooltip_btn">
                          {el?.property_code?.length > 10
                            ? `${el?.property_code.substring(0, 10)}...`
                            : el?.property_code}
                        </Button>
                      </OverlayTrigger>
                    </div>
                    <div>
                      <OverlayTrigger
                        placement={"top"}
                        overlay={<Tooltip> {el?.legal_name}</Tooltip>}
                      >
                        <Button className="build_tooltip_btn">
                          {el?.legal_name?.length > 10
                            ? `${el?.legal_name.substring(0, 10)}...`
                            : el?.legal_name}
                        </Button>
                      </OverlayTrigger>
                    </div>
                    <div>
                      <OverlayTrigger
                        placement={"top"}
                        overlay={<Tooltip> {el?.name}</Tooltip>}
                      >
                        <Button className="build_tooltip_btn">
                          {el?.name?.length > 10
                            ? `${el?.name.substring(0, 10)}...`
                            : el?.name}
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </div>

                  <div className="building_rows">
                    {el?.buildingsArray?.map((elem, buildIndex) => {
                      return (
                        <>
                          <div>
                            <div className="home_propCode_main">
                              <span class="material-symbols-outlined building_home_icon">
                                home
                              </span>
                              {elem?.building_code}
                            </div>
                            <div className="property_hr_main">
                              <div className="steeper_property_hr"></div>
                            </div>

                            <div className="building_name_field_main">
                              <Form.Group className="setting_name build_name_field">
                                <div className="setting_name_div">
                                  {t("common.pages.Name")}
                                </div>
                                <Form.Control
                                  name="name"
                                  type="text"
                                  required={true}
                                  onChange={(e) =>
                                    handleChange(e, index, buildIndex)
                                  }
                                  className="setting_name_field"
                                  value={elem?.name}
                                />
                              </Form.Group>

                              <div
                                className="building_more_btn_main"
                                onClick={() =>
                                  openSidePanel(
                                    el?.property_code,
                                    elem,
                                    index,
                                    buildIndex
                                  )
                                }
                              >
                                <span class="material-symbols-outlined">
                                  more_horiz
                                </span>
                              </div>
                            </div>
                            <div className="property_hr_main">
                              <div className="property_hr building_name_hr"></div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                  <div className="building_footer_main"></div>
                </div>
                {sidePanel && <SidePanelRoot />}
              </div>
            );
          })}
        </div>
        <div className="step1_submit_btn_main step_4continue">
          <Button className="step1_started_btn" onClick={() => handleNext()}>
            {t("common.pages.Continue")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BuildingsPage;
