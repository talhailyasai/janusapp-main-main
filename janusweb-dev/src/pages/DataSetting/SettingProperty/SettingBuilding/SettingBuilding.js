import React, { useEffect, useState } from "react";
import "./SettingBuilding.css";
import api from "api";
import { useTranslation } from "react-i18next";
const SettingBuilding = () => {
  const [allBuildings, setAllBuildings] = useState([]);
  const [curUser, setCurUser] = useState(null);
  const { t } = useTranslation();

  const getAllSettingBuilding = async () => {
    const res = await api.get("/datasetting-buildings");
    setAllBuildings(res.data);
  };

  const getCurrentUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let res = await api.get(`/users/${user?._id}`);
      setCurUser(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllSettingBuilding();
    getCurrentUser();
  }, []);
  return (
    <div className="setting_building_main">
      {/* {curUser?.plan === "Enterprise" && ( */}
      {/* // <> */}
      {/* Facade */}
      <div className="setting_administrative_main setting_building">
        <div className="setting_administrative">
          {t("property_page.facade")}
        </div>
        {allBuildings[0]?.value?.map((elem) => (
          <p className="administrative_value">{elem}</p>
        ))}
      </div>
      {/* Windows */}
      <div className="setting_administrative_main setting_building">
        <div className="setting_administrative">
          {t("property_page.windows")}
        </div>
        {allBuildings[1]?.value?.map((elem) => (
          <p className="administrative_value">{elem}</p>
        ))}
      </div>

      {/* Doors */}
      <div className="setting_administrative_main setting_building">
        <div className="setting_administrative">
          {t("property_page.Setting_doors")}
        </div>
        {allBuildings[2]?.value?.map((elem) => (
          <p className="administrative_value">{elem}</p>
        ))}
      </div>

      {/* roof */}
      <div className="setting_administrative_main setting_building">
        <div className="setting_administrative">{t("property_page.roof")} </div>
        {allBuildings[3]?.value?.map((elem) => (
          <p className="administrative_value">{elem}</p>
        ))}
      </div>

      {/* foundation */}

      <div className="setting_administrative_main setting_building">
        <div className="setting_administrative">
          {t("property_page.foundation")}
        </div>
        {allBuildings[4]?.value?.map((elem) => (
          <p className="administrative_value">{elem}</p>
        ))}
      </div>

      {/* electricity */}

      <div className="setting_administrative_main setting_building">
        <div className="setting_administrative">
          {t("property_page.electricity")}
        </div>
        {allBuildings[5]?.value?.map((elem) => (
          <p className="administrative_value">{elem}</p>
        ))}
      </div>

      {/* heating */}
      <div className="setting_administrative_main setting_building">
        <div className="setting_administrative">
          {" "}
          {t("property_page.heating")}
        </div>
        {allBuildings[6]?.value?.map((elem) => (
          <p className="administrative_value">{elem}</p>
        ))}
      </div>

      {/* Heat Distribution */}
      <div className="setting_administrative_main setting_building">
        <div className="setting_administrative">
          {t("property_page.heat_distribution")}
        </div>
        {allBuildings[7]?.value?.map((elem) => (
          <p className="administrative_value">{elem}</p>
        ))}
      </div>

      {/* <div> */}
        {/* Ventilation */}
        <div className="setting_administrative_main setting_building">
          <div className="setting_administrative">Ventilation</div>
          {allBuildings[8]?.value?.map((elem) => (
            <p className="administrative_value">{elem}</p>
          ))}
        </div>

        {/* Waste Management */}
        <div className="setting_administrative_main setting_building">
          <div className="setting_administrative">Waste Management</div>
          {allBuildings[9]?.value?.map((elem) => (
            <p className="administrative_value">{elem}</p>
          ))}
        </div>
      </div>
    // </div>
  );
};

export default SettingBuilding;
