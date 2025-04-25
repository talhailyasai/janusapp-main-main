import React, { useEffect, useState } from "react";
import "./style.css";
import DiagramImage from "../../../../assets/img/newPlan.png"; // Make sure the image is in the same directory or adjust the path accordingly
import { useTranslation } from "react-i18next";
import { Button } from "@themesberg/react-bootstrap";
import Articales from "../../../../utils/articales.json";
import { generateRandomString } from "utils/helper";
import { getMaintenanceSettings } from "utils/MaintenanceReport";

const ERPModel = ({ plans, setPlans, setStopStep, building, setStep }) => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [checkItems, setCheckItems] = useState([]);
  const [maintenanceSettings, setMaintenanceSettings] = useState(null);
  console.log("articles", Articales.length);
  const onChange = (e) => {
    let res = Articales?.filter((el) => {
      // console.log("Articales", e.target.name, el.u_system, el);
      return (
        el.u_system.includes(e.target.name) &&
        !el?.condition &&
        !el?.if_condition
      );
    });
    res = res?.map((el) => {
      return {
        ...el,
        building_code: building?.build?.building_code,
        property_code: building?.build?.property_code,
        tenantId: user?._id,
        city: building?.build?.city,
      };
    });
    if (e.target.checked) {
      let condition_arr = Articales?.filter(
        (el) => el.u_system.includes(e.target.name) && el?.condition
      );
      let arr = [];
      if (condition_arr.length > 0) {
        condition_arr?.map((obj) => {
          console.log(
            "Articales",
            e.target.name,
            building?.build[obj?.condition_target],
            obj,
            obj?.condition_target
          );

          if (
            obj?.condition_value?.includes(
              building?.build[obj?.condition_target]
            )
          ) {
            arr.push({
              ...obj,
              building_code: building?.build?.building_code,
              property_code: building?.build?.property_code,
              tenantId: user?._id,
            });
          }
        });
      }
      let if_condition_arr = Articales?.filter(
        (el) => el.u_system.includes(e.target.name) && el?.if_condition
      );

      if (if_condition_arr.length > 0) {
        if_condition_arr?.map((obj) => {
          if (building?.build[obj?.if_condition]) {
            arr.push({
              ...obj,
              building_code: building?.build?.building_code,
              property_code: building?.build?.property_code,
              tenantId: user?._id,
            });
          }
        });
      }
      let array = [...plans, ...res, ...arr];
      array = array?.map((el) => {
        return {
          ...el,
          key: generateRandomString(7),
        };
      });

      let arr_items = [
        ...checkItems,
        { name: e.target.name, value: e.target.value },
      ];

      setCheckItems(arr_items);

      let find_plans = plans?.filter((el) =>
        el.u_system.includes(e.target.name)
      );
      if (find_plans.length == 0) {
        setPlans(array);
      }
    } else {
      let arr = checkItems?.filter(
        (el) => el.name !== e.target.name && el.value !== e.target.value
      );
      setCheckItems(arr);
      arr = arr?.filter((el) => el.name == e.target.name);
      if (arr.length == 0) {
        let res = plans.filter((el) => !el.u_system.includes(e.target.name));
        setPlans(res);
      }
    }
  };

  const handleBack = () => {
    setStopStep("selectBuilding");
  };

  useEffect(() => {
    setPlans([]);
    getMaintenanceSettings(setMaintenanceSettings);
  }, []);
  const handlePlans = () => {
    if (building?.build?.construction_year) {
      const planDuration = parseInt(maintenanceSettings?.plan_duration);
      const startYear = parseInt(building?.build?.construction_year);
      const updatedPlans = [];
      const planStartYear = parseInt(maintenanceSettings?.plan_start_year);
      const planYearsInterval = planStartYear + planDuration;

      // Step 1: Add start_year to each plan object
      plans.forEach((plan, index) => {
        plan.start_year = startYear;
      });

      // Step 2: Create separate arrays for each plan based on its technical life
      plans.forEach((plan) => {
        let currentYear = plan.start_year;
        const technicalLife = parseInt(plan.technical_life);
        const planArray = [];
        while (currentYear < planStartYear) {
          currentYear += technicalLife;
        }
        if (technicalLife > planDuration) {
          planArray.push({
            ...plan,
            start_year: "",
            id: Math.floor(Math.random() * 1000000),
          });
        } else {
          for (
            let year = startYear;
            year < startYear + planDuration && currentYear <= planYearsInterval;
            year += parseInt(technicalLife)
          ) {
            planArray.push({
              ...plan,
              start_year: currentYear,
              id: Math.floor(Math.random() * 1000000),
            });
            currentYear = parseInt(currentYear) + parseInt(technicalLife);
          }
        }

        updatedPlans.push(planArray); // Push each plan's array into updatedPlans
      });

      setPlans([...updatedPlans.flat()]);
    } else {
      // Case where start_year is not available
      const updatedPlans = plans.map((plan) => ({
        ...plan,
        id: Math.floor(Math.random() * 1000000), // Just add an ID if start_year doesn't exist
      }));

      setPlans(updatedPlans);
    }
    setStopStep("coverPlanTable");
    setStep(4);
  };
  return (
    <>
      <span
        class="material-symbols-outlined step_arrow_back"
        onClick={handleBack}
      >
        arrow_back
      </span>
      <div className="diagram-main">
        <div className="_head">
          {t("common.pages.Which areas should the plan cover?")}
        </div>
        <div className="diagram">
          <img
            src={DiagramImage}
            alt="Building?.build Diagram"
            className="diagram-image"
          />
          <div className="label check_1">
            <input
              type="checkbox"
              name="SC5.1"
              value={"Electrical system (SC5)"}
              onChange={onChange}
            />
            {t("common.pages.Electrical system")} (SC5.1)
          </div>
          <div className="label check_2">
            <input
              type="checkbox"
              value={"Heating system (SC4)"}
              name="SC4.6"
              onChange={onChange}
            />
            {t("common.pages.Heating system")} (SC4.6)
          </div>
          <div className="label check_3">
            <input
              type="checkbox"
              value={"Ventilation (SC4)"}
              name="SC4.7"
              onChange={onChange}
            />
            {t("common.pages.Ventilation")} (SC4.7)
          </div>
          <div className="label check_4">
            <input
              type="checkbox"
              value={"Water and sewer (SC4)"}
              name="SC4.3"
              onChange={onChange}
            />
            {t("common.pages.Water and sewer")} (SC4.3)
          </div>
          <div className="label check_5">
            <input
              type="checkbox"
              value={"Drainage (SC4)"}
              name="SC4.1"
              onChange={onChange}
            />
            {t("common.pages.Drainage")} (SC4.1)
          </div>
          <div className="label check_6">
            <input
              type="checkbox"
              value={"Vegetation (SD2)"}
              name="SD2"
              onChange={onChange}
            />
            {t("common.pages.Vegetation")} (SD2)
          </div>
          <div className="label check_7">
            <input
              type="checkbox"
              value={"Playground (SD5)"}
              name="SD5"
              onChange={onChange}
            />
            {t("common.pages.Playground")} (SD5)
          </div>
          <div className="label check_8">
            <input
              type="checkbox"
              value={"Ground coverings (SD3)"}
              name="SD3"
              onChange={onChange}
            />
            {t("common.pages.Ground Coverings")} (SD3)
          </div>
          <div className="label check_9">
            <input
              type="checkbox"
              value={"Roof (SC2)"}
              name="SC2.1.1"
              onChange={onChange}
            />
            {t("common.pages.Roof")} (SC2.1.1)
          </div>
          <div className="label sc2 check_10">
            <input
              type="checkbox"
              value={"Roof drainage (SC2)"}
              name="SC2.1.2"
              onChange={onChange}
            />
            {t("common.pages.Roof drainage")} (SC2.1.2)
          </div>
          <div className="label sc2 check_11">
            <input
              type="checkbox"
              value={"Facade (SC2)"}
              name="SC2.2.1"
              onChange={onChange}
            />
            {t("common.pages.Facade")} (SC2.2.1)
          </div>
          <div className="label sc2 check_12">
            <input
              type="checkbox"
              value={"Balconies (SC2)"}
              name="SC2.2.2"
              onChange={onChange}
            />
            {t("common.pages.Balconies")} (SC2.2.2)
          </div>
          <div className="label sc2 check_13">
            <input
              type="checkbox"
              value={"Windows (SC2)"}
              name="SC2.2.3"
              onChange={onChange}
            />
            {t("common.pages.Windows")} (SC2.2.3)
          </div>
          <div className="label sc3 check_14">
            <input
              type="checkbox"
              value={"Stairwell (SC3)"}
              name="SC3.2.1"
              onChange={onChange}
            />
            {t("common.pages.Stairwell")} (SC3.2.1)
          </div>
          <div className="label sc3 check_15">
            <input
              type="checkbox"
              value={"Common space (SC3)"}
              name="SC3.2.9"
              onChange={onChange}
            />
            {t("common.pages.Common space")} (SC3.2.9)
          </div>
          <div className="label sc3 check_16">
            <input
              type="checkbox"
              value={"Laundry (SC3)"}
              name="SC3.2.2"
              onChange={onChange}
            />
            {t("common.pages.Laundry")} (SC3.2.2)
          </div>
          <div className="label sc7 check_17">
            <input
              type="checkbox"
              value={"Elevator (SC7)"}
              name="SC7.1"
              onChange={onChange}
            />
            {t("common.pages.Elevator")} (SC7.1)
          </div>
          <div className="label sc2 check_18">
            <input
              type="checkbox"
              value={"Entrance (SC2)"}
              name="SC2.3"
              onChange={onChange}
            />
            {t("common.pages.Entrance")} (SC2.3)
          </div>
          <div className="label sc6 check_19">
            <input
              type="checkbox"
              value={"Access system (SC6)"}
              name="SC6.2"
              onChange={onChange}
            />
            {t("common.pages.Access system")} (SC6.2)
          </div>
          <div className="label sc8 check_20">
            <input
              type="checkbox"
              value={"Garbage disposal (SC8)"}
              name="SC8.1"
              onChange={onChange}
            />
            {t("common.pages.Garbage disposal")} (SC8.1)
          </div>
        </div>
        <Button
          className="step1_started_btn"
          disabled={plans.length == 0 ? true : false}
          onClick={async (e) => {
            e.preventDefault();
            await handlePlans();
            console.log(
              "plans in continue",
              plans,
              "start_year",
              building.build.start_year
            );
          }}
        >
          {t("common.pages.Continue")}
        </Button>
      </div>
    </>
  );
};

export default ERPModel;
