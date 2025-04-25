import { Form } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";

import Button from "components/common/Button";
import { useTranslation } from "react-i18next";

const ComponentPackageSidePanel = ({
  handleSubmit,
  close,
  initalVal,
  newTask,
  handleClose,
}) => {
  const [modifyProperty, setModifyProperty] = useState(initalVal);
  const { t } = useTranslation();

  const handleChange = (e) => {
    setModifyProperty((prev) => ({
      ...prev,
      [e.target.name]: e.target.value?.toUpperCase(),
    }));
  };
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e, modifyProperty);
        close && close();
        handleClose && handleClose();
      }}
    >
      <SidePanel>
        <SidePanelHeader>
          {initalVal?._id ? t("common.pages.modify") : ""}
          {t("data_settings.New_Component_Package")}
        </SidePanelHeader>
        <SidePanelBody>
          <div className="activity-input-container">
            <Form.Group>
              <Form.Label>{t("data_settings.Package Name")}</Form.Label>
              <Form.Control
                name="component_package"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.component_package}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("data_settings.Package Description")}</Form.Label>
              <Form.Control
                name="packageDescription"
                type="text"
                // required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.packageDescription}
              />
            </Form.Group>
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

export default ComponentPackageSidePanel;
