import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
} from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { useOnboarding } from "context/OnboardingContext";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { toast } from "react-toastify";
import "../../../OnBoarding/Step5/Buildings/Buildings.css";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import BuuildingSidePanel from "pages/OnBoarding/Step5/Buildings/BuuildingSidePanel";

const BuildingNamesForm = () => {
  const { t } = useTranslation();
  const {
    nextStep,
    properties,
    setProperties,
    buildingDetails,
    setBuildingDetails,
    setActiveProperty,
    setActiveBuilding,
    setBuidlingArray,
  } = useOnboarding();
  const { accountStats } = usePropertyContextCheck();
  const [sidePanel, setSidePanel] = useState(false);

  const handleChange = (e, propKey, buildKey) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const updatedData = properties?.map((el, ind) => {
      if (el?.key === propKey) {
        const updatedBuildingsArray = el?.buildingsArray?.map((elem, index) => {
          if (elem?.key === buildKey) {
            return {
              ...elem,
              [e.target.name]: e.target.value?.toUpperCase(),
            };
          }
          return elem;
        });
        return {
          ...el,
          buildingsArray: updatedBuildingsArray,
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
      toast.error(accountStats?.data?.messages?.[type]);
      return true;
    }
    return false;
  };

  const handleNext = () => {
    let isEmptyBuildName = false;
    let totalBuildingCount = 0;

    properties?.forEach((prop) => {
      prop?.buildingsArray?.forEach((build) => {
        if (!build?.name || build?.name === "") {
          isEmptyBuildName = true;
        }
        totalBuildingCount++;
      });
    });

    if (isEmptyBuildName) {
      return toast.error(t("common.pages.Please enter building name!"));
    }

    if (checkExceedLimits(totalBuildingCount, "buildings")) {
      return;
    }
    setActiveProperty(null);
    setActiveBuilding(null);
    setBuidlingArray({ property_index: 0, array: [] });
    nextStep();
  };

  const openSidePanel = (propCode, build, propKey, buildKey) => {
    // console.log(build);
    setBuildingDetails({
      propCode,
      build,
      propKey,
      buildKey,
    });
    setSidePanel(true);
  };

  const handleSubmit = async (e, buildingDetails) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    let updatedData = properties?.map((el, ind) => {
      if (el.key === buildingDetails?.propKey) {
        let updatedBuildingsArray = el?.buildingsArray?.map((elem, index) => {
          if (elem.key === buildingDetails?.key) {
            return {
              ...buildingDetails,
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

    // console.log(updatedData, "updatedData");

    setProperties(updatedData);
    setSidePanel(false);
  };

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
          propKey: buildingDetails?.propKey,
          buildKey: buildingDetails?.buildKey,
          key: buildingDetails.buildKey,
        },
        handleClose: () => {
          setBuildingDetails({});
          setSidePanel(false);
        },
      });
    }
  }, [sidePanel]);

  return (
    <>
      <div className="stepper_build_page">
        <p className="building_page_head">
          {t("common.pages.Enter the name of each building and its properties")}
        </p>
        <div className="buildingsPage_main">
          {properties?.map((property, propIndex) => (
            <div key={property.key || propIndex}>
              <div className="buildings_main">
                <div className="buildings_header">
                  <div>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{property?.property_code}</Tooltip>}
                    >
                      <Button className="build_tooltip_btn">
                        {property?.property_code?.length > 10
                          ? `${property.property_code.substring(0, 10)}...`
                          : property?.property_code}
                      </Button>
                    </OverlayTrigger>
                  </div>
                  <div>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{property?.legal_name}</Tooltip>}
                    >
                      <Button className="build_tooltip_btn">
                        {property?.legal_name?.length > 10
                          ? `${property.legal_name.substring(0, 10)}...`
                          : property?.legal_name}
                      </Button>
                    </OverlayTrigger>
                  </div>
                  <div>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{property?.name}</Tooltip>}
                    >
                      <Button className="build_tooltip_btn">
                        {property?.name?.length > 10
                          ? `${property.name.substring(0, 10)}...`
                          : property?.name}
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>

                <div className="building_rows">
                  {property?.buildingsArray?.map((building, buildIndex) => (
                    <div key={building.key || buildIndex}>
                      <div className="home_propCode_main">
                        <span className="material-symbols-outlined building_home_icon">
                          home
                        </span>
                        {building?.building_code}
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
                              handleChange(e, property?.key, building?.key)
                            }
                            className="setting_name_field"
                            value={building?.name}
                          />
                        </Form.Group>

                        <div
                          className="building_more_btn_main"
                          onClick={() =>
                            openSidePanel(
                              building?.property_code,
                              building,
                              property?.key,
                              building?.key
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
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {sidePanel && <SidePanelRoot />}

        <div className="step1_submit_btn_main step_4continue">
          <Button className="step1_started_btn" onClick={handleNext}>
            {t("common.pages.Continue")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BuildingNamesForm;
