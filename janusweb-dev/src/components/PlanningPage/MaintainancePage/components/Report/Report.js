import React from "react";
import Tabs from "../../../../../components/common/Tabs";
import { useState } from "react";
import { useEffect } from "react";
import MaintainancePage from "../../../../../components/PlanningPage/MaintainancePage";
import { useTranslation } from "react-i18next";

const Report = ({ printItem, createReport, handleChangeAction }) => {
  const defaultState = () => <p>Please select a Plan</p>;

  const [ActiveComponent, setActiveComponent] = useState({
    Component: defaultState,
    props: {},
  });
  const [currReprtTab, setCurrRepotTab] = useState("activitesyear");
  const { t } = useTranslation();
  useEffect(() => {
    setActiveComponent({
      Component: MaintainancePage,
    });
  }, []);

  const maintainceTabValues = [
    {
      name: t("planning_page.activities_per_year"),
      id: "activitesyear",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        activitesyear: true,
        printItem,
        createReport,
        handleChangeAction,
        currReprtTab,
      },
    },
    {
      name: t("planning_page.activities_per_type"),
      id: "activitestype",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        activitesType: true,
        printItem,
        createReport,
        handleChangeAction,
        currReprtTab,
      },
    },
  ];

  return (
    <div>
      {/* <div style={{ width: "50%" }}> */}
      <Tabs
        tabValues={maintainceTabValues}
        onTabChange={(item) => setCurrRepotTab(item)}
        colLg={12}
      />
      {/* </div> */}
    </div>
  );
};

export default Report;
