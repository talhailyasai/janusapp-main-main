import React, { useEffect, useRef, useState } from "react";
import CreateEditPlan from "./components/CreateEditPlan";
import Overview from "./components/Overview";
import { usePlanningContextCheck } from "context/SidebarContext/PlanningContextCheck";
import { FilterPlanning, SortPlanning } from "lib/PlanningLib";
import Loader from "components/common/Loader";
import BatchEditing from "./components/BatchEditing";
import { useTranslation } from "react-i18next";
import Analysis from "./components/Analysis/Analysis";
import Report from "./components/Report/Report";
import Activitesyear from "./components/Report/ActivitesYear/activitesyear";
import ActivitesType from "./components/Report/ActivitesType/ActivitesType";
import { t } from "i18next";
import MaintenanceReports from "./components/MaintenanceReport/MaintenanceReport";
import "./index.css";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

const MaintainancePage = ({
  createEditPlan,
  overview,
  batchediting,
  analysis,
  report,
  activitesyear,
  activitesType,
  MaintenanceReport,
  ...props
}) => {
  const {
    planningChange,
    buildingChange,
    reloadCreateEdit,
    setReloadCreateEdit,
    setPlanningChange,
    setBuildingChange,
  } = usePlanningContextCheck();
  const { currentTab } = usePropertyContextCheck();

  const [sort, setSort] = useState({
    id: null,
    order: "asc",
    sort: false,
  });
  const { t } = useTranslation();

  const [singlePlanningData, setSinglePlanningData] = useState(undefined);
  const selectedCreatEditPlan = useRef(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newPropId = urlParams.get("prop_id");
    const newBuildId = urlParams.get("build_code");
    if (newBuildId || newPropId) {
      selectedCreatEditPlan.current = true;

      if (newBuildId && newBuildId !== buildingChange)
        setBuildingChange(newBuildId);
      if (newPropId && newPropId !== setPlanningChange)
        setPlanningChange(newPropId);
    } else if (!newBuildId || !newPropId) {
      selectedCreatEditPlan.current = false;
    }
  }, [window.location.search]);
  useEffect(() => {
    const fetchData = async () => {
      if (buildingChange) {
        const data = await FilterPlanning({
          body: JSON.stringify({
            property_code: [planningChange],
            building_code: [buildingChange],
          }),
        });
        const jsonData = await data.json();

        setSinglePlanningData(jsonData);
      } else if (planningChange) {

        const data = await FilterPlanning({
          body: JSON.stringify({
            property_code: [planningChange],
          }),
        });
        const jsonData = await data.json();

        setSinglePlanningData(jsonData);
      }
    };
    fetchData();
    setReloadCreateEdit(false);
  }, [planningChange, buildingChange, reloadCreateEdit, currentTab]);

  const handleSortClick = async (id, order, limit, filters) => {
    await setSort({ id, order, sort: true });
  };
  // if (!singlePlanningData) return <Loader />;
  if (!planningChange && createEditPlan) {
    return <p>{t("planning_page.select_property")} </p>;
  }
  return (
    <div>
      {createEditPlan || selectedCreatEditPlan.current ? (
        <CreateEditPlan
          {...props}
          handleSortClick={handleSortClick}
          sort={sort}
          singlePlanningData={singlePlanningData}
        />
      ) : overview ? (
        <Overview
          {...props}
          sort={sort}
          handleSortClick={handleSortClick}
          singlePlanningData={singlePlanningData}
        />
      ) : batchediting ? (
        <BatchEditing
          {...props}
          sort={sort}
          handleSortClick={handleSortClick}
          singlePlanningData={singlePlanningData}
        />
      ) : analysis ? (
        <Analysis {...props} />
      ) : report ? (
        <Report {...props} />
      ) : activitesyear ? (
        <Activitesyear {...props} />
      ) : activitesType ? (
        <ActivitesType {...props} />
      ) : MaintenanceReport ? (
        <MaintenanceReports />
      ) : (
        t("planning_page.please_select_a_valid_option")
      )}
    </div>
  );
};

export default MaintainancePage;
