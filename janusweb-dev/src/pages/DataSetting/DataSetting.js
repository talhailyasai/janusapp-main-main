import React from "react";
import { useState } from "react";
import Tabs from "../../components/common/Tabs";
import DataSettingPage from "./index";
import { useTranslation } from "react-i18next";

const DataSetting = () => {
  // // tab state
  const [ActiveComponent, setActiveComponent] = useState({
    Component: DataSettingPage,
    props: {},
  });
  const { t } = useTranslation();

  const dataSettingTabValues = [
    {
      name: t("data_settings.maintenance_settings"),
      id: "maintenanceSetting",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        maintenanceSetting: true,
      },
    },
    {
      name: t("data_settings.maintenance_depositions"),
      id: "maintenanceDepositions",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        maintenanceDepositions: true,
      },
    },
    {
      name: t("data_settings.maintenance_items"),
      id: "maintenanceItem",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        maintenanceItem: true,
      },
    },
    {
      name: t("data_settings.maintenance_package"),
      id: "maintenancePackage",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        maintenancePackage: true,
      },
    },
    {
      name: t("planning_page.Maintenance_report"),
      id: "MaintenanceReport",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        MaintenanceReport: true,
      },
    },
  ];

  return (
    <div className="datasetting_tabs">
      <Tabs
        tabValues={dataSettingTabValues}
        colLg={12}
        activeTabId={localStorage?.getItem("activeTabSettingMaintenance")}
        settingMaintenance={true}
      />
    </div>
  );
};

export default DataSetting;
