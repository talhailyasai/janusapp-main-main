import { Form } from "@themesberg/react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";
import MainData from "components/PropertyPage/BuildingDetails/components/MainData";
import Attributes from "components/PropertyPage/BuildingDetails/components/Attributes";
import Data1 from "components/PropertyPage/BuildingDetails/components/Quantities";
import Button from "components/common/Button";
import { useTranslation } from "react-i18next";

const BuuildingSidePanel = ({ handleSubmit, initalVal, handleClose }) => {
  const [buildigDetail, setBuildigDetail] = useState(initalVal);
  const areaBtaRef = useRef(false);
  const areaTempRef = useRef(false);
  const { t } = useTranslation();

  const defaultProps = {
    required: false,
    handleChange: (e) => {
      const { name, value } = e.target;
      setBuildigDetail((prev) => {
        const updatedValues = {
          ...prev,
          [name]: value.toUpperCase(),
        };
        if (name === "area_bta") areaBtaRef.current = true;
        if (name === "area_a_temp") areaTempRef.current = true;

        // Calculate and update dependent fields
        if (name === "area_bra") {
          if (!areaBtaRef.current)
            updatedValues.area_bta = Math.round(value / 0.9);
          if (!areaTempRef.current) updatedValues.area_a_temp = value;
        }
        if (name === "area_bta") {
          areaBtaRef.current = !!value;
        }

        if (name === "area_a_temp") {
          areaTempRef.current = !!value;
        }
        console.log("type of value", name, value, updatedValues);
        return updatedValues;
      });
    },
  };
  // console.log({ modifyBuilding: buildigDetail });
  return (
    <Form
      onSubmit={(e) => {
        handleSubmit(e, buildigDetail);
      }}
      className="building-side-panel-form"
    >
      <SidePanel>
        <SidePanelHeader>{t("common.pages.Building Details")}</SidePanelHeader>
        <SidePanelBody>
          {buildigDetail?.target ? (
            <div className="activity-input-container">
              {buildigDetail?.target == "attributes" && (
                <Attributes
                  mdCol={12}
                  defaultProps={defaultProps}
                  modifyBuilding={buildigDetail}
                  setBuildigDetail={setBuildigDetail}
                  area={false}
                  attributes={true}
                />
              )}
              {buildigDetail?.target == "area" && (
                <Attributes
                  mdCol={12}
                  defaultProps={defaultProps}
                  modifyBuilding={buildigDetail}
                  area={true}
                  attributes={false}
                />
              )}
              {buildigDetail?.target == "quantity" && (
                <Data1
                  mdCol={12}
                  defaultProps={defaultProps}
                  modifyBuilding={buildigDetail}
                  imageUploader={true}
                  sidePanel={true}
                  setModifyBuilding={setBuildigDetail}
                />
              )}
            </div>
          ) : (
            <div className="activity-input-container">
              <MainData
                mdCol={12}
                sidePanel={true}
                newTask={true}
                defaultProps={defaultProps}
                modifyBuilding={buildigDetail}
                onboarding={true}
              />
              <Attributes
                mdCol={12}
                defaultProps={defaultProps}
                modifyBuilding={buildigDetail}
              />
              <Data1
                mdCol={12}
                defaultProps={defaultProps}
                modifyBuilding={buildigDetail}
                imageUploader={true}
                sidePanel={true}
              />
            </div>
          )}
        </SidePanelBody>
        <SidePanelFooter>
          <Button main type="submit">
            {t("property_page.submit")}
          </Button>
          <Button
            secondary
            type="button"
            onClick={() => {
              handleClose();
            }}
          >
            {t("property_page.cancel")}
          </Button>
        </SidePanelFooter>
      </SidePanel>
    </Form>
  );
};

export default BuuildingSidePanel;

// export default BuuildingSidePanel;
