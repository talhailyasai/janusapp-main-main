import React, { useEffect, useState } from "react";
import Tabs from "../../components/common/Tabs";
import SupervisionPage from "./index";
import { useTranslation } from "react-i18next";
import "./Supervision.css";
import Planning from "./Planning/Planning";
import FollowUp from "./FollowUp/FollowUp";
import Analysis from "./Analysis/Analysis";
const Supervision = () => {
  // // tab state
  const [currTab, setCurrTab] = useState("planning");
  const [ActiveComponent, setActiveComponent] = useState({
    Component: SupervisionPage,
    props: {},
  });
  const { t } = useTranslation();

  const supervisionTabValues = [
    {
      name: t("common.pages.planning"),
      id: "planning",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        planning: true,
        currTab,
      },
    },
    {
      name: t("common.pages.follow_up"),
      id: "followUp",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        followUp: true,
        currTab,
      },
    },
    {
      name: t("planning_page.analysis"),
      id: "analysis",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        analysis: true,
        currTab,
      },
    },
  ];

  const getQueryParam = (name) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
  };
  useEffect(() => {
    const tabValue = getQueryParam("tab");
    if (tabValue) {
      setCurrTab(tabValue);
    }
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <Tabs
        tabValues={supervisionTabValues}
        colLg={12}
        activeTabId={currTab}
        onTabChange={setCurrTab}
        notShowChild={true}
      />
      <div className="py-4" style={{ overflowX: "visible" }}>
        {currTab === "planning" ? (
          <Planning />
        ) : currTab === "followUp" ? (
          <FollowUp />
        ) : currTab === "analysis" ? (
          <Analysis />
        ) : null}
      </div>
    </div>
  );
};

export default Supervision;
