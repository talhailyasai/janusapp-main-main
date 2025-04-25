import React from "react";
import PropertyTab from "./PropertyTab/index";
import SettingBuilding from "./SettingBuilding/SettingBuilding";
import SettingAddresses from "./SettingAddresses/SettingAddresses";
import SettingRentalObjects from "./SettingRentalObjects/SettingRentalObjects";

const SettingPropertyPage = ({
  settingProperty,
  settingBuilding,
  settingAddresses,
  settingRentalObjects,
  ...props
}) => {
  return (
    <div>
      {settingProperty ? (
        <PropertyTab />
      ) : settingBuilding ? (
        <SettingBuilding />
      ) : settingAddresses ? (
        <SettingAddresses />
      ) : settingRentalObjects ? (
        <SettingRentalObjects />
      ) : null}
    </div>
  );
};

export default SettingPropertyPage;
