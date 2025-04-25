import { Form, Table } from "@themesberg/react-bootstrap";
import api from "api";
import Loader from "components/common/Loader";
import { t } from "i18next";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Filter from "../../Supervision/Planning/PlanningFilter";
import { FilterSupervisionPlanning } from "lib/PlanningLib";
import { monthsWithWeeks } from "utils/AnalysisContent";

const Analysis = () => {
  const [loading, setLoading] = useState(false);
  const [selector, setSelector] = useState("months");
  const [analysisData, setAnalysisData] = useState(null);
  const [dupAnalysisData, setDupAnalysisData] = useState(null);

  const [collapseRows, setCollapsRows] = useState([]);
  // Filter State
  const [filterValues, setFilterValues] = useState({});
  const [checkedMonths, setCheckedMonths] = useState([]);

  const handleSelector = (value) => {
    setSelector(value);
    setCheckedMonths([]);
  };

  const getAnalysisData = async (query) => {
    setLoading(true);
    try {
      let data = await api.get("/supervision/getAnalysis", query);
      //debugger;
      setAnalysisData(data?.data);
      setDupAnalysisData(data?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  console.log({ analysisData });

  const handleCollapseRow = (buildingId) => {
    let isPresent = collapseRows.find((el) => el === buildingId);
    if (isPresent) {
      setCollapsRows(collapseRows.filter((el) => el !== buildingId));
    } else {
      setCollapsRows([...collapseRows, buildingId]);
    }
  };

  useEffect(() => {
    getAnalysisData();
  }, []);

  // Filter Code
  const handleFindClick = async () => {
    if (
      filterValues?.property_code?.length === 0 &&
      filterValues?.responsible_user?.length === 0
    ) {
      setAnalysisData(dupAnalysisData);
    } else {
      let filteredArrays = dupAnalysisData;
      if (filterValues?.property_code?.length > 0) {
        filteredArrays = dupAnalysisData?.filter((innerArray) => {
          const obj = innerArray[0];
          return filterValues?.property_code?.includes(obj?.property_code);
        });
      }
      if (filterValues?.responsible_user?.length > 0) {
        filteredArrays = filteredArrays
          .map((buildingArray) => {
            const building = buildingArray[0]; // Get the building object
            return [
              {
                ...building,
                components: building?.components?.filter((comp) =>
                  filterValues?.responsible_user?.includes(
                    comp?.responsible_user?.toLowerCase()
                  )
                ),
              },
            ];
          })
          .filter((buildingArray) => buildingArray[0].components?.length > 0); // Remove buildings with no matching components
      }
      setAnalysisData(filteredArrays);
    }
  };
  const monthMap = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };
  function calculateOccurrences(
    startDate,
    interval,
    duration,
    selectedPeriods
  ) {
    function addInterval(date, interval, duration) {
      let newDate = new Date(date);
      let year = newDate.getFullYear();
      let month = newDate.getMonth();
      let day = newDate.getDate();

      switch (duration) {
        case "day":
          return new Date(year, month, day + interval);
        case "week":
          return new Date(year, month, day + interval * 7);
        case "month":
          return new Date(
            year + Math.floor((month + interval) / 12),

            (month + interval) % 12,

            day
          ); // Corrected month overflow
        case "year":
          return new Date(year + interval, month, day);
        default:
          throw new Error("Invalid duration");
      }
    }
    if (selectedPeriods[0]?.startsWith("q")) {
      selectedPeriods = selectedPeriods
        .map((period) => {
          const quarter = parseInt(period.substring(1));
          return [
            Object.keys(monthMap)[(quarter - 1) * 3],
            Object.keys(monthMap)[(quarter - 1) * 3 + 1],
            Object.keys(monthMap)[(quarter - 1) * 3 + 2],
          ];
        })
        .flat();
    }
    const occurrences = {}; // Store results as an object
    selectedPeriods.forEach((period) => (occurrences[period] = 0)); // Initialize counts

    let currentDate = new Date(startDate);
    const presentDate = new Date();
    const presentYear = presentDate.getFullYear();

    // Skip the first occurrence
    currentDate = addInterval(currentDate, interval, duration);

    while (currentDate.getFullYear() === presentYear) {
      const currentMonth = currentDate.getMonth();
      const currentDay = currentDate.getDate();
      const currentWeekOfYear = getWeekOfYear(currentDate);

      selectedPeriods.forEach((period) => {
        let periodType = "";
        let periodNumber = 0;

        if (period.startsWith("week")) {
          periodType = "week";
          periodNumber = parseInt(period.substring(4));
          if (currentWeekOfYear === periodNumber) {
            occurrences[period]++;
          }
        } else if (Object.keys(monthMap).includes(period.toLowerCase())) {
          periodType = "month";
          periodNumber = monthMap[period.toLowerCase()];
          if (currentMonth === periodNumber) {
            occurrences[period]++;
          }
        }
      });

      currentDate = addInterval(currentDate, interval, duration);
    }

    return occurrences;
  }

  function getWeekOfYear(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  const calculateQuota = (e) => {
    //debugger;

    let months;
    if (!e.target.checked) {
      months = checkedMonths?.filter((el) => el !== e.target.name);
    } else {
      months = [...checkedMonths, e.target.name];
    }
    setCheckedMonths(months);

    if (months?.length > 0) {
      if (months[0]?.startsWith("q")) {
        months = months
          .map((period) => {
            const quarter = parseInt(period.substring(1));
            return [
              Object.keys(monthMap)[(quarter - 1) * 3],
              Object.keys(monthMap)[(quarter - 1) * 3 + 1],
              Object.keys(monthMap)[(quarter - 1) * 3 + 2],
            ];
          })
          .flat();
      }
      let updatedData = analysisData?.map((buildings) => {
        //debugger;
        let updatedBuildings = buildings?.map((b) => {
          //debugger;
          let updatedComps = b?.components?.map((component) => {
            // if (
            //   component?.component_code === "CL4580" &&
            //   b?.building_code === "100501"
            // ) {
            //   //debugger;
            // }

            const attendance_interval_value =
              component?.attendance_interval_value;
            const attendance_interval_unit =
              component?.attendance_interval_unit;
            const maintenance_interval_value =
              component?.maintenance_interval_value;
            const maintenance_interval_unit =
              component?.maintenance_interval_unit;
            const maintenance_plan_date = component?.maintenance_plan_date;
            const attendance_plan_date = component?.attendance_plan_date;
            const compCode = component?.compCode;
            //Example 1: Months
            console.log(
              "months",
              months,
              "maintenance_plan_date",
              maintenance_plan_date,
              "attendance_plan_date",
              attendance_plan_date,
              "attendance_interval_value",
              attendance_interval_value,
              "attendance_interval_unit",
              attendance_interval_unit,
              "maintenance_interval_value",
              maintenance_interval_value,
              "maintenance_interval_unit",
              maintenance_interval_unit
            );
            // return;
            const attendStartDate = new Date(attendance_plan_date);
            const attendInterval = parseInt(attendance_interval_value);

            let attendDuration =
              attendance_interval_unit == "M" ? "month" : "week";

            let attendResult = calculateOccurrences(
              attendStartDate,
              attendInterval,
              attendDuration,
              months
            );
            const maintStartDate = new Date(maintenance_plan_date);
            const maintInterval = parseInt(maintenance_interval_value);
            let maintDuration =
              maintenance_interval_unit == "M" ? "month" : "week";

            let maintResult = calculateOccurrences(
              maintStartDate,
              maintInterval,
              maintDuration,
              months
            );
            const combinedResult = Object.entries(attendResult).reduce(
              (acc, [key, value]) => {
                acc[key] = (acc[key] || 0) + value;
                return acc;
              },
              { ...maintResult }
            );

            console.log(combinedResult);
            console.log(
              "compCode >>>>",
              compCode,
              "months maintResult:",
              maintResult,
              "attendResult",
              attendResult,
              "combinedResult",
              combinedResult
            );
            let actualOccurrences = 0;
            let expectedOccurrences = 0;

            // Sum up expected occurrences from combinedResult for selected months
            months?.forEach((month) => {
              if (combinedResult[month.toLowerCase()]) {
                expectedOccurrences += combinedResult[month.toLowerCase()];
              }

              // Count actual occurrences from component's monthly data
              if (
                component?.monthly?.[month.toLowerCase()]?.length > 0 &&
                !month.includes("week") &&
                !month.includes("q")
              ) {
                console.log(
                  "months Monthly occurrences for",
                  month,
                  ":",
                  component.monthly[month.toLowerCase()].length,
                  "Total:",
                  actualOccurrences
                );
                actualOccurrences +=
                  component.monthly[month.toLowerCase()].length;
              } else if (
                component?.weekly?.[month.toLowerCase()]?.length > 0 &&
                month.includes("week")
              ) {
                console.log(
                  "months Weekly occurrences for",
                  month,
                  ":",
                  component.weekly[month.toLowerCase()].length,
                  "Total:",
                  actualOccurrences
                );

                actualOccurrences +=
                  component.weekly[month.toLowerCase()].length;
              } else if (
                component?.quarterly?.[month.toLowerCase()]?.length > 0 &&
                month.includes("q")
              ) {
                console.log(
                  "months Quarterly occurrences for",
                  month,
                  ":",
                  component.quarterly[month.toLowerCase()].length,
                  "Total:",
                  actualOccurrences
                );
                actualOccurrences +=
                  component.quarterly[month.toLowerCase()].length;
              }
            });

            // Calculate percentage
            let percent =
              expectedOccurrences > 0
                ? Math.round((actualOccurrences / expectedOccurrences) * 100)
                : "-";

            // Cap at 100%
            if (percent > 100) {
              percent = 100;
            }

            component.percent = percent;

            return component;
          });
          return {
            ...b,
            components: updatedComps,
          };
        });
        return updatedBuildings;
      });
      setAnalysisData(updatedData);
    }
  };

  // First, define the data structures
  const quarters = [
    { id: "q1", label: "Jan-Mar", months: ["jan", "feb", "mar"] },
    { id: "q2", label: "Apr-Jun", months: ["apr", "may", "jun"] },
    { id: "q3", label: "Jul-Sep", months: ["jul", "aug", "sep"] },
    { id: "q4", label: "Oct-Dec", months: ["oct", "nov", "dec"] },
  ];

  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  return loading ? (
    <div style={{ marginBottom: "1rem" }}>
      <Loader />
    </div>
  ) : (
    <div>
      <Filter
        handleFindClick={handleFindClick}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
      />
      <div style={{ display: "flex" }}>
        <div className="superVanalysisMain">
          {["quarters", "months"].includes(selector) ? (
            <Table bordered className="tableSuper">
              <thead>
                {selector === "quarters" && (
                  <tr className="activites_header analysisHeader">
                    <th className="fixed-column"></th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          className="analysis_jan_label"
                          onClick={calculateQuota}
                          name="q1"
                        ></Form.Check>
                        <span className="supervision_property_name">
                          JAN-MAR
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          className="analysis_jan_label"
                          onClick={calculateQuota}
                          name="q2"
                        ></Form.Check>

                        <span className="supervision_property_name">
                          APR-JUNE
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          className="analysis_jan_label"
                          onClick={calculateQuota}
                          name="q3"
                        ></Form.Check>

                        <span className="supervision_property_name">
                          JULY-SEP
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          className="analysis_jan_label"
                          onClick={calculateQuota}
                          name="q4"
                        ></Form.Check>

                        <span className="supervision_property_name">
                          OCT-DEC
                        </span>
                      </div>
                    </th>
                  </tr>
                )}
                {selector !== "quarters" && (
                  <tr className="activites_header analysisHeader">
                    <th className="fixed-column"></th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          name="jan"
                          onChange={calculateQuota}
                          className="analysis_jan_label"
                        ></Form.Check>
                        <span className="supervision_property_name">
                          {t("common.pages.Jan")}
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          name="feb"
                          onChange={calculateQuota}
                          className="analysis_jan_label"
                        ></Form.Check>
                        <span className="supervision_property_name">
                          {t("common.pages.Feb")}
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          name="mar"
                          onChange={calculateQuota}
                          className="analysis_jan_label"
                        ></Form.Check>
                        <span className="supervision_property_name">
                          {t("common.pages.Mar")}
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          name="apr"
                          onChange={calculateQuota}
                          className="analysis_jan_label"
                        ></Form.Check>

                        <span className="supervision_property_name">
                          {t("common.pages.April")}
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          name="may"
                          onChange={calculateQuota}
                          className="analysis_jan_label"
                        ></Form.Check>
                        <span className="supervision_property_name">
                          {t("property_page.May")}
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          name="jun"
                          onChange={calculateQuota}
                          className="analysis_jan_label"
                        ></Form.Check>

                        <span className="supervision_property_name">
                          {t("common.pages.June")}
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          name="jul"
                          onChange={calculateQuota}
                          className="analysis_jan_label"
                        ></Form.Check>

                        <span className="supervision_property_name">
                          {t("common.pages.July")}
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          name="aug"
                          onChange={calculateQuota}
                          className="analysis_jan_label"
                        ></Form.Check>
                        <span className="supervision_property_name">
                          {t("common.pages.August")}
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          name="sep"
                          onChange={calculateQuota}
                          className="analysis_jan_label"
                        ></Form.Check>

                        <span className="supervision_property_name">
                          {t("common.pages.September")}
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          name="oct"
                          onChange={calculateQuota}
                          className="analysis_jan_label"
                        ></Form.Check>

                        <span className="supervision_property_name">
                          {t("common.pages.October")}
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          name="nov"
                          onChange={calculateQuota}
                          className="analysis_jan_label"
                        ></Form.Check>
                        <span className="supervision_property_name">
                          {t("common.pages.November")}
                        </span>
                      </div>
                    </th>
                    <th className="yearsColunm">
                      <div className="analysisTableHeaders">
                        <Form.Check
                          type="checkbox"
                          name="dec"
                          onChange={calculateQuota}
                          className="analysis_jan_label"
                        ></Form.Check>
                        <span className="supervision_property_name">
                          {t("common.pages.December")}
                        </span>
                      </div>
                    </th>
                  </tr>
                )}
              </thead>
              <tbody className="activites_year_table_main">
                {analysisData?.map((ad) => {
                  return ad?.map((el) => {
                    if (el?.components?.length === 0) return;
                    let isCollapsed = collapseRows?.find(
                      (build) => build === el?.building_code
                    );
                    return (
                      <>
                        <tr className="activites_start_year headerRow">
                          <td
                            className="fixed-column headerRow"
                            style={{
                              padding: "0.3rem 0.5rem",
                              fontWeight: "700",
                            }}
                          >
                            <div
                              className="d-flex justify-content-between align-items-center c-pointer"
                              onClick={() =>
                                handleCollapseRow(el?.building_code)
                              }
                            >
                              <div>
                                <div className="d-flex">
                                  <span class="material-symbols-outlined propertyIcon">
                                    home_work
                                  </span>
                                  <p className="mb-0 fWgt supervision_property_name">
                                    {el?.Property}
                                  </p>
                                </div>
                                <div className="d-flex buildingHead">
                                  <span class="material-symbols-outlined buildingIcon">
                                    home
                                  </span>
                                  <p className="mb-0 fWgt supervision_property_name">
                                    {el?.building}
                                  </p>
                                </div>
                              </div>
                              {isCollapsed ? (
                                // ..
                                <span class="material-symbols-outlined analysis_expand_icon">
                                  chevron_right
                                </span>
                              ) : (
                                <span class="material-symbols-outlined analysis_expand_icon">
                                  expand_more
                                </span>
                              )}
                            </div>
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          {selector !== "quarters" && (
                            <>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </>
                          )}
                        </tr>
                        {!isCollapsed &&
                          el?.components?.map((comp) => {
                            return (
                              <>
                                <tr className="activites_start_year activites_activity analysisRow">
                                  <td className="reportYearTD fixed-column">
                                    <div className="compDataMain">
                                      <div className="compColunm">
                                        <div
                                          className="compColor"
                                          id={
                                            comp?.u_system &&
                                            comp?.u_system?.substring(0, 3)
                                          }
                                        >
                                          {/* {comp?.u_system} */}
                                        </div>

                                        <div className="compName supervision_property_name">
                                          {comp?.compCode}
                                        </div>
                                      </div>
                                      {/* {comp?.percent !== null &&
                                        comp?.percent !== undefined && */}
                                      {checkedMonths?.length > 0 && (
                                        <div className="compPercent">
                                          <span>
                                            {comp?.percent || 0}
                                            {comp?.percent === "-" ? "" : "%"}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  {selector === "quarters"
                                    ? // Render quarter data
                                      quarters.map((quarter) => (
                                        <td
                                          key={quarter.id}
                                          className="reportYearTD text-center"
                                        >
                                          <div className="d-flex">
                                            {comp?.quarterly?.[quarter.id]?.map(
                                              (val, idx) => (
                                                <div
                                                  key={`${quarter.id}-${idx}`}
                                                  className={`plottingValue ${`value${val}`}`}
                                                >
                                                  {val}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </td>
                                      ))
                                    : // Render month data
                                      months.map((month) => (
                                        <td
                                          key={month}
                                          className="reportYearTD text-center"
                                        >
                                          <div className="d-flex">
                                            {comp?.monthly?.[month]?.map(
                                              (val, idx) => (
                                                <div
                                                  key={`${month}-${idx}`}
                                                  className={`plottingValue ${`value${val}`}`}
                                                >
                                                  {val}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </td>
                                      ))}
                                  {/* <td className="reportYearTD text-center">
                                    <div className="d-flex">
                                      {comp?.monthly?.jan?.map((val) => (
                                        <div
                                          className={`plottingValue ${`value${val}`}`}
                                        >
                                          {val}
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="reportYearTD text-center">
                                    <div className="d-flex">
                                      {comp?.monthly?.feb?.map((val) => (
                                        <div
                                          className={`plottingValue ${`value${val}`}`}
                                        >
                                          {val}
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="reportYearTD text-center">
                                    <div className="d-flex">
                                      {comp?.monthly?.mar?.map((val) => (
                                        <div
                                          className={`plottingValue ${`value${val}`}`}
                                        >
                                          {val}
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="reportYearTD text-center">
                                    <div className="d-flex">
                                      {comp?.monthly?.apr?.map((val) => (
                                        <div
                                          className={`plottingValue ${`value${val}`}`}
                                        >
                                          {val}
                                        </div>
                                      ))}
                                    </div>
                                  </td> */}

                                  {/* {selector !== "quarters" && (
                                    <>
                                      <td className="reportYearTD text-center">
                                        <div className="d-flex">
                                          {comp?.monthly?.may?.map((val) => (
                                            <div
                                              className={`plottingValue ${`value${val}`}`}
                                            >
                                              {val}
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="reportYearTD text-center">
                                        <div className="d-flex">
                                          {comp?.monthly?.june?.map((val) => (
                                            <div
                                              className={`plottingValue ${`value${val}`}`}
                                            >
                                              {val}
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="reportYearTD text-center">
                                        <div className="d-flex">
                                          {comp?.monthly?.july?.map((val) => (
                                            <div
                                              className={`plottingValue ${`value${val}`}`}
                                            >
                                              {val}
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="reportYearTD text-center">
                                        <div className="d-flex">
                                          {comp?.monthly?.aug?.map((val) => (
                                            <div
                                              className={`plottingValue ${`value${val}`}`}
                                            >
                                              {val}
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="reportYearTD text-center">
                                        <div className="d-flex">
                                          {comp?.monthly?.sep?.map((val) => (
                                            <div
                                              className={`plottingValue ${`value${val}`}`}
                                            >
                                              {val}
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="reportYearTD text-center">
                                        <div className="d-flex">
                                          {comp?.monthly?.oct?.map((val) => (
                                            <div
                                              className={`plottingValue ${`value${val}`}`}
                                            >
                                              {val}
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="reportYearTD text-center">
                                        <div className="d-flex">
                                          {comp?.monthly?.nov?.map((val) => (
                                            <div
                                              className={`plottingValue ${`value${val}`}`}
                                            >
                                              {val}
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="reportYearTD text-center">
                                        <div className="d-flex">
                                          {comp?.monthly?.dec?.map((val) => (
                                            <div
                                              className={`plottingValue ${`value${val}`}`}
                                            >
                                              {val}
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                    </>
                                  )} */}
                                </tr>
                              </>
                            );
                          })}
                      </>
                    );
                  });
                })}
              </tbody>
            </Table>
          ) : (
            <Table bordered className="tableSuper">
              <thead>
                <tr className="activites_header analysisHeader">
                  <th className="fixed-column"></th>
                  {monthsWithWeeks(t)?.map((el, index) => {
                    const weekNum = parseInt(el.match(/\-(\d+)\)$/)[1]);

                    return (
                      <th className="yearsColunm">
                        <div className="analysisTableHeaders">
                          <Form.Check
                            type="checkbox"
                            className="analysis_jan_label"
                            onClick={calculateQuota}
                            name={`week${weekNum}`}
                          ></Form.Check>

                          <span class="supervision_property_name"> {el}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="activites_year_table_main">
                {analysisData?.map((ad) => {
                  return ad?.map((el) => {
                    if (el?.components?.length === 0) return;
                    let isCollapsed = collapseRows?.find(
                      (build) => build === el?.building_code
                    );
                    return (
                      <>
                        <tr className="activites_start_year headerRow">
                          <td
                            className="fixed-column headerRow"
                            style={{
                              padding: "0.3rem 0.5rem",
                              fontWeight: "700",
                            }}
                          >
                            <div
                              className="d-flex justify-content-between align-items-center c-pointer"
                              onClick={() =>
                                handleCollapseRow(el?.building_code)
                              }
                            >
                              <div>
                                <div className="d-flex">
                                  <span class="material-symbols-outlined propertyIcon">
                                    home_work
                                  </span>
                                  <p className="mb-0 fWgt supervision_property_name">
                                    {el?.Property}
                                  </p>
                                </div>
                                <div className="d-flex buildingHead">
                                  <span class="material-symbols-outlined buildingIcon">
                                    home
                                  </span>
                                  <p className="mb-0 fWgt supervision_property_name">
                                    {el?.building}
                                  </p>
                                </div>
                              </div>
                              {isCollapsed ? (
                                // ...
                                <span class="material-symbols-outlined analysis_expand_icon">
                                  chevron_right
                                </span>
                              ) : (
                                <span class="material-symbols-outlined analysis_expand_icon">
                                  expand_more
                                </span>
                              )}
                            </div>
                          </td>
                          {monthsWithWeeks(t)?.map((mw) => {
                            return <td></td>;
                          })}
                        </tr>
                        {!isCollapsed &&
                          el?.components?.map((comp) => {
                            return (
                              <>
                                <tr className="activites_start_year activites_activity analysisRow">
                                  <td className="reportYearTD fixed-column">
                                    <div className="compDataMain">
                                      <div className="compColunm">
                                        <div
                                          className="compColor"
                                          id={comp?.u_system}
                                        >
                                          {/* {comp?.u_system} */}
                                        </div>

                                        <div className="compName supervision_property_name">
                                          {/* {comp?.long_name} */}
                                          {comp?.compCode}
                                        </div>
                                      </div>
                                      {
                                        // comp?.percent !== null &&
                                        //   comp?.percent !== undefined &&
                                        checkedMonths?.length > 0 && (
                                          <div className="compPercent">
                                            <span>
                                              {comp?.percent || 0}
                                              {comp?.percent === "-" ? "" : "%"}
                                            </span>
                                          </div>
                                        )
                                      }
                                    </div>
                                  </td>
                                  {Array.from(
                                    { length: 52 },
                                    (_, i) => i + 1
                                  ).map((weekNum) => (
                                    <td
                                      key={`week${weekNum}`}
                                      className="reportYearTD text-center"
                                    >
                                      <div className="d-flex">
                                        {comp?.weekly?.[`week${weekNum}`]?.map(
                                          (val, idx) => (
                                            <div
                                              key={`week${weekNum}-${idx}`}
                                              className={`plottingValue ${`value${val}`}`}
                                            >
                                              {val}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </td>
                                  ))}
                                </tr>
                              </>
                            );
                          })}
                      </>
                    );
                  });
                })}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      <div className="analysisBottom">
        <div
          className={`bottomSelector ${
            selector === "weeks" ? "activeSelector" : ""
          }`}
          onClick={() => handleSelector("weeks")}
        >
          {t("property_page.Weeks")}
        </div>
        <div className="pipeLine"></div>
        <div
          className={`bottomSelector ${
            selector === "months" ? "activeSelector" : ""
          }`}
          onClick={() => handleSelector("months")}
        >
          {t("property_page.Months")}
        </div>
        <div className="pipeLine"></div>
        <div
          className={`bottomSelector ${
            selector === "quarters" ? "activeSelector" : ""
          }`}
          onClick={() => handleSelector("quarters")}
        >
          {t("property_page.Quarters")}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
