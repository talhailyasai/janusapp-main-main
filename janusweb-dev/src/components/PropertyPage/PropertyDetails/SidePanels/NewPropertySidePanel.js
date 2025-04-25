import { Form } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";
import MainData from "../components/MainData";
import Attributes from "../components/Attributes";
import Data1 from "../components/Info";
import Button from "components/common/Button";
import { useTranslation } from "react-i18next";

const NewPropertySidePanel = ({
  handleSubmit,
  close,
  initalVal,
  newTask,
  handleClose,
}) => {
  const [modifyProperty, setModifyProperty] = useState(initalVal);
  const { t } = useTranslation();

  const defaultProps = {
    required: false,
    handleChange: (e) =>
      setModifyProperty((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      })),
  };
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e, modifyProperty);
        // handleClose && handleClose();
        // close && close();
      }}
      className="building-side-panel-form"
    >
      <SidePanel>
        <SidePanelHeader>{t("property_page.new_property")}</SidePanelHeader>
        <SidePanelBody>
          <div className="activity-input-container">
            <MainData
              mdCol={12}
              newTask={newTask}
              sidePanel={true}
              defaultProps={defaultProps}
              modifyProperty={modifyProperty}
            />
            <Attributes
              mdCol={12}
              sidePanel={true}
              defaultProps={defaultProps}
              modifyProperty={modifyProperty}
            />
            <Data1
              mdCol={12}
              defaultProps={defaultProps}
              sidePanel={true}
              modifyProperty={modifyProperty}
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

export default NewPropertySidePanel;
