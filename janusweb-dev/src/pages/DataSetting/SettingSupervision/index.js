import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tabs from "../../../components/common/Tabs";
import SettingSupervision from "./SettingSupervision";

const Index = () => {
  // // tab state
  const [ActiveComponent, setActiveComponent] = useState({
    Component: SettingSupervision,
    props: {},
  });
  const { t } = useTranslation();

  const SettingSupervisionTabValues = [
    {
      name: t("property_page.components"),
      id: "components",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        components: true,
      },
    },
    {
      name: t("data_settings.component_packages"),
      id: "componentPackages",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        componentPackages: true,
      },
    },
  ];

  return (
    <div className="datasetting_tabs">
      <Tabs tabValues={SettingSupervisionTabValues} colLg={12} />
    </div>
  );
};

export default Index;
