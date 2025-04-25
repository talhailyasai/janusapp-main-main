import React from "react";
import Planning from "./Planning/Planning";
import Analysis from "./Analysis/Analysis";
import FollowUp from "./FollowUp/FollowUp";

const SupervisionPage = ({
  planning,
  followUp,
  analysis,
  currTab,
  ...props
}) => {
  return (
    <div>
      {currTab === "planning" ? (
        <Planning />
      ) : currTab === "followUp" ? (
        <FollowUp />
      ) : currTab === "analysis" ? (
        <Analysis />
      ) : null}
    </div>
  );
};

export default SupervisionPage;
