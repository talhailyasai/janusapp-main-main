import React, { useEffect, useState } from "react";
import SettingPropertyPage from ".";
import { useTranslation } from "react-i18next";
import Tabs from "../../../components/common/Tabs";
import api from "api";

const SettingProperty = () => {
  // // tab state
  const [ActiveComponent, setActiveComponent] = useState({
    Component: SettingPropertyPage,
    props: {},
  });
  const { t } = useTranslation();

  const SettingPropertyTabValues = [
    {
      name: t("common.pages.Property"),
      id: "settingProperty",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        settingProperty: true,
      },
    },
    {
      name: t("common.pages.building"),
      id: "settingBuilding",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        settingBuilding: true,
      },
    },
    {
      name: t("common.pages.Addresses"),
      id: "settingAddresses",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        settingAddresses: true,
      },
    },
    {
      name: t("property_page.rental_objects"),
      id: "settingRentalObjects",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        settingRentalObjects: true,
      },
    },
  ];

  return (
    <div className="datasetting_tabs">
      <Tabs tabValues={SettingPropertyTabValues} colLg={12} />
    </div>
  );
};

export default SettingProperty;
