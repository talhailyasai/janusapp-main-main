import React, { useEffect, useState } from "react";
import DisabledInputBox from "./common/InputBox";
import { usePropertyContextCheck } from "../context/SidebarContext/PropertyContextCheck";
import { CreateNewActivity, EditActivityById } from "../lib/ActivityLib";
import CheckBox from "./common/CheckBox";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "./common/SidePanel";
import { useTranslation } from "react-i18next";
import Button from "components/common/Button";

let initalVal = {};

const ActivityPanel = ({
  handleClose,
  newActivity,
  modifyActivity,
  deleteActivity,
  selectedActivity,
  close,
}) => {
  const [modifyActivityData, setModifyActivityData] = useState(initalVal);
  const { t } = useTranslation();
  const { property, buildingObj, compObj, componentChange, setActivityAdded } =
    usePropertyContextCheck();

  const handleChange = (e) => {
    if (e.target.name === "activity") {
      setModifyActivityData({
        ...modifyActivityData,
        [e.target.name]: e.target.value,
      });
    } else {
      setModifyActivityData({
        ...modifyActivityData,
        [e.target.name]: e.target.value.toUpperCase(),
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modifyActivity)
      // Modify Api
      await EditActivityById(selectedActivity?._id, {
        body: JSON.stringify(modifyActivityData),
      }).then(() => {
        // window.location.reload();
        setActivityAdded({});
        close && close();
        handleClose && handleClose();
      });
    else if (newActivity)
      // Create Api
      await CreateNewActivity({
        body: JSON.stringify({
          property: property?._id,
          building: buildingObj?._id,
          component: compObj?._id,
          compCode: componentChange,
          changed_date: new Date().toISOString().substr(0, 10),
          user: "JANUS",
          ...modifyActivityData,
        }),
      }).then(() => {
        // window.location.reload();
        setActivityAdded({});
        close && close();
        handleClose && handleClose();
      });
  };
  useEffect(() => {
    if (modifyActivity) setModifyActivityData(selectedActivity);
    else if (newActivity) setModifyActivityData(initalVal);
  }, [newActivity, modifyActivity, selectedActivity]);
  const defaultProps = {
    disabled: modifyActivity ? false : newActivity ? false : true,
    required: newActivity,
    handleChange: handleChange,
  };
  return (
    <form onSubmit={handleSubmit}>
      <SidePanel>
        <SidePanelHeader>
          {newActivity ? t("planning_page.add_new") : t("common.pages.modify")}{" "}
          {t("planning_page.activity")}
        </SidePanelHeader>
        <SidePanelBody>
          <div className="activity-input-container">
            <DisabledInputBox
              {...defaultProps}
              type={"date"}
              mdCol={12}
              text={t("property_page.Date")}
              id={"date"}
              value={
                newActivity
                  ? new Date(modifyActivityData?.date)
                      .toISOString()
                      .substr(0, 10)
                  : new Date(modifyActivityData?.date || null)
                      .toISOString()
                      .substr(0, 10)
              }
            />
            <DisabledInputBox
              {...defaultProps}
              mdCol={12}
              text={t("property_page.Signature")}
              id={"user"}
              value={modifyActivityData?.user || ""}
            />
            <div className="d-flex justify-content-around">
              <CheckBox
                {...defaultProps}
                type="radio"
                checked={modifyActivityData?.activity === "Tillsyn"}
                onChange={handleChange}
                value={"Tillsyn"}
                text={t("Attendance")}
                id={"activity"}
              />
              <CheckBox
                {...defaultProps}
                checked={modifyActivityData?.activity === "Skötsel"}
                type="radio"
                value={"Skötsel"}
                onChange={handleChange}
                text={t("Maintenance")}
                id={"activity"}
              />
            </div>
            <DisabledInputBox
              {...defaultProps}
              mdCol={12}
              text={t("property_page.Remark")}
              id={"remark"}
              required={false}
              value={modifyActivityData?.remark}
            />
          </div>
        </SidePanelBody>

        <SidePanelFooter>
          <Button main type="submit">
            {t("property_page.submit")}
          </Button>
          <Button
            secondary
            type="button"
            onClick={() => {
              handleClose();
              close();
            }}
          >
            {t("property_page.cancel")}
          </Button>
        </SidePanelFooter>
      </SidePanel>
    </form>
  );
};

initalVal = {
  date: new Date().toISOString().substr(0, 10),
  activity: "Tillsyn",
};
export default ActivityPanel;
