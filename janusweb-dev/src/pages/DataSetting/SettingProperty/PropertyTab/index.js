import api from "api";
import React, { useEffect, useState } from "react";
import "./index.css";
import { useTranslation } from "react-i18next";

const PropertyTab = () => {
  const [allProperty, setAllProperty] = useState([]);
  const { t } = useTranslation();
  const [curUser, setCurUser] = useState(null);

  const getAllSettingProperty = async () => {
    const res = await api.get("/datasetting-property");
    setAllProperty(res.data);
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
    getAllSettingProperty();
    getCurrentUser();
  }, []);

  return (
    <div className="setting_administrative_property_main">
      {curUser?.plan === "Enterprise" && (
        <>
          {/* Administrative Area */}
          <div className="setting_administrative_main">
            <div className="setting_administrative">
              {t("property_page.administrative_area")}
            </div>
            {allProperty?.map((elem) => (
              <p className="administrative_value">
                {elem?.administrativeArea[0]?.name}
              </p>
            ))}
          </div>
          {/* Operations Area */}
          <div className="setting_administrative_main">
            <div className="setting_administrative">
              {" "}
              {t("property_page.operations_area")}
            </div>
            {allProperty?.map((elem) => (
              <p className="administrative_value">
                {elem?.operationsArea[0]?.name}
              </p>
            ))}
          </div>
          {/* // Use Type */}
          <div className="setting_administrative_main">
            <div className="setting_administrative">
              {t("property_page.Use_Type")}{" "}
            </div>
            {allProperty?.map((elem) => (
              <p className="administrative_value">{elem?.useType[0]?.name}</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyTab;
