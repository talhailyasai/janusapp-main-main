import React, { useEffect, useState } from "react";
import MaintenanceItem from "./MaintenanceItem/maintenanceItem";
import api from "api";
import MaintenancePackage from "./MaintenancePackage/maintenancePackage";
import MaintenanceSetting from "./MaintenanceSetting/MaintenanceSetting";
import MaintenanceDepositions from "./MaintenanceDepositions/MaintenanceDepositions";
import MaintenanceReports from "components/PlanningPage/MaintainancePage/components/MaintenanceReport/MaintenanceReport";
import "./index.css";

const DataSettingPage = ({
  maintenanceItem,
  maintenancePackage,
  components,
  componentPackages,
  tables,
  maintenanceSetting,
  maintenanceDepositions,
  MaintenanceReport,
  ...props
}) => {
  const [maintenanceItemPkgs, setMaintenanceItemPkgs] = useState([]);
  // MaintenanceItem UseEffect

  const getAllMaintenanceItem = async () => {
    const res = await api.get("/maintaince_items");
    setMaintenanceItemPkgs(
      res.data?.sort((a, b) => (a.order > b.order ? 1 : -1))
    );
  };

  useEffect(() => {
    getAllMaintenanceItem();
  }, []);
  // ...........................................

  return (
    <div>
      {maintenanceItem ? (
        <>
          <MaintenanceItem
            setMaintenanceItemPkgs={setMaintenanceItemPkgs}
            maintenanceItemPkgs={maintenanceItemPkgs}
          />
        </>
      ) : maintenancePackage ? (
        <>
          <MaintenancePackage maintenanceItemPkgs={maintenanceItemPkgs} />
        </>
      ) : maintenanceSetting ? (
        <>
          <MaintenanceSetting />
        </>
      ) : maintenanceDepositions ? (
        <>
          <MaintenanceDepositions />
        </>
      ) : MaintenanceReport ? (
        <MaintenanceReports />
      ) : null}
    </div>
  );
};

export default DataSettingPage;
