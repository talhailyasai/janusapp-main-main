import { Form } from "@themesberg/react-bootstrap";
import React, { useRef, useState } from "react";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";
import MainData from "../components/MainData";
import Attributes from "../components/Attributes";
import Data1 from "../components/Quantities";
import Button from "components/common/Button";
import { useTranslation } from "react-i18next";

const NewBuildingSidePanel = ({
  handleSubmit,
  close,
  initalVal,
  newTask,
  handleClose,
}) => {
  const [modifyBuilding, setModifyBuilding] = useState(initalVal);
  const { t } = useTranslation();
  const areaBtaRef = useRef(false);
  const areaTempRef = useRef(false);
  const defaultProps = {
    required: false,
    handleChange: (e) => {
      const { name, value } = e.target;

      setModifyBuilding((prev) => {
        const updatedValues = {
          ...prev,
          [name]: value.toUpperCase(), // Convert the value to uppercase
        };

        // Tracking refs for dependent fields
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

        console.log("type of value", typeof value);
        return updatedValues;
      });
    },
  };
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e, modifyBuilding);
        // handleClose && handleClose();
        // close && close();
      }}
      className="building-side-panel-form"
    >
      <SidePanel>
        <SidePanelHeader>
          {t("common.pages.new")}
          {t("property_page.building_action")}
        </SidePanelHeader>
        <SidePanelBody>
          <div className="activity-input-container">
            <MainData
              mdCol={12}
              sidePanel={true}
              newTask={newTask}
              defaultProps={defaultProps}
              modifyBuilding={modifyBuilding}
            />
            <Attributes
              mdCol={12}
              defaultProps={defaultProps}
              modifyBuilding={modifyBuilding}
            />
            <Data1
              mdCol={12}
              defaultProps={defaultProps}
              modifyBuilding={modifyBuilding}
              imageUploader={true}
              sidePanel={true}
              setModifyBuilding={setModifyBuilding}
            />
          </div>
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
              close();
            }}
          >
            {t("property_page.cancel")}
          </Button>
        </SidePanelFooter>
      </SidePanel>
    </Form>
  );
};

export default NewBuildingSidePanel;
