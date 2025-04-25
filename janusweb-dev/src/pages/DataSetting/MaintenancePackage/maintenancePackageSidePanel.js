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

const MaintenancePackageSidePanel = ({
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
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <Form
      onSubmit={(e) => {
        handleSubmit(e, modifyProperty);
      }}
    >
      <SidePanel>
        <SidePanelHeader>
          {initalVal?._id ? t("common.pages.modify") : t("common.pages.new")}{" "}
          {t("data_settings.maintenance_package")}
        </SidePanelHeader>
        <SidePanelBody>
          <div className="activity-input-container">
            <Form.Group>
              <Form.Label>{t("data_settings.package_name")}</Form.Label>
              <Form.Control
                name="maintenance_package"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.maintenance_package}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("data_settings.description")}</Form.Label>
              <Form.Control
                name="packageDescription"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.packageDescription}
              />
            </Form.Group>
          </div>
        </SidePanelBody>
        <SidePanelFooter>
          <Button main type="submit">
            {t("planning_page.submit")}
          </Button>
          <Button
            secondary
            type="button"
            onClick={() => {
              handleClose();
              close();
            }}
          >
            {t("planning_page.cancel")}
          </Button>
        </SidePanelFooter>
      </SidePanel>
    </Form>
  );
};

export default MaintenancePackageSidePanel;
