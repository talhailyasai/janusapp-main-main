import { Form } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
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
import { t } from "i18next";

const ModifyComponentSidePanel = ({
  handleSubmit,
  close,
  singleComponentData,
  handleClose,
}) => {
  const [modifyComponent, setModifyComponent] = useState(singleComponentData);
  useEffect(() => {
    setModifyComponent(singleComponentData);
  }, [singleComponentData]);
  const defaultProps = {
    required: false,
    handleChange: (e) =>
      setModifyComponent((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      })),
  };
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e, modifyComponent);
        handleClose && handleClose();
        close && close();
      }}
      className="building-side-panel-form"
    >
      <SidePanel>
        <SidePanelHeader>
          {t("common.pages.modify")} {t("common.pages.component")}
        </SidePanelHeader>
        <SidePanelBody>
          <div className="activity-input-container">
            <MainData
              mdCol={12}
              sidePanel={true}
              defaultProps={defaultProps}
              modifyComponent={modifyComponent}
              setModifyComponent={setModifyComponent}
            />
            <Attributes
              mdCol={12}
              defaultProps={defaultProps}
              modifyComponent={modifyComponent}
            />
            <Data1
              mdCol={12}
              defaultProps={defaultProps}
              modifyComponent={modifyComponent}
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

export default ModifyComponentSidePanel;
