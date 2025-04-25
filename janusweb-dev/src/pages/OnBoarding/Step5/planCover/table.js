import {
  Button,
  Table,
  OverlayTrigger,
  Popover,
  Modal,
  Row,
  Form,
  Col,
  Tooltip,
} from "@themesberg/react-bootstrap";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdArrowRight,
  MdDeleteOutline,
  MdArrowForward,
} from "react-icons/md";
// import plans from "../../../../utils/articales.json";

import "./style.css";
import api from "api";
import Loader from "components/common/Loader";
import InputBox from "components/common/InputBox";
import InputBoxDropDown from "components/common/InputBoxDropDown";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { generateRandomString } from "utils/helper";
import DataTable from "react-data-table-component";
import { getMaintenanceSettings } from "utils/MaintenanceReport";
import { useHistory } from "react-router-dom";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

const PlanTable = ({
  plans,
  building,
  step,
  setStopStep,
  setPlans,
  setStep,
  properties,
  existProperty,
  setExistProperty,
  selectPlan,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { t } = useTranslation();
  const [active, setActive] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [type, setType] = useState(null);
  const [state, setState] = useState(null);
  const [systemCodes, setSystemCodes] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showMaxBuildingModal, setShowMaxBuildingModal] = useState(false);
  const [maxBuildingMessage, setMaxBuildingMessage] = useState("");
  const [maintenanceSettings, setMaintenanceSettings] = useState(null);
  const history = useHistory();
  const { windowDimension } = usePropertyContextCheck();

  const handleDelete = (row, isParent) => {
    if (isParent) {
      let res = plans?.filter((el) => el.article !== row?.article);
      setPlans(res);
    } else {
      let res = plans?.filter((el) => el.id !== row?.id);
      setPlans(res);
    }
  };

  const onChangePlan = (key, val, type, row) => {
    if (!row?.start_year && type === "start_year") {
      let currentYear = parseInt(val);
      const technicalLife = parseInt(row?.technical_life) || 50;
      const planDuration = parseInt(maintenanceSettings?.plan_duration) || 50;
      const planStartYear =
        parseInt(maintenanceSettings?.plan_start_year) || 50;
      const planYearsInterval = planStartYear + planDuration;
      const newPlans = [];

      while (
        currentYear < parseInt(val) + planDuration &&
        currentYear <= planYearsInterval
      ) {
        newPlans.push({
          ...row,
          building_code: building?.build?.building_code,
          property_code: building?.build?.property_code,
          name: building?.build?.name,
          start_year: currentYear,
          prev_year: row?.prev_year && row?.prev_year,
          default_amount: row?.default_amount,
          total_cost:
            parseInt(row?.default_amount) * parseInt(row?.price_per_unit),
          tenantId: user?._id,
          key: generateRandomString(7),
          id: Math.floor(Math.random() * 1000000),
          technical_life: row?.technical_life,
        });

        currentYear += technicalLife;
      }

      const parentRowIndex = plans?.findIndex((plan) => plan?.id === row?.id);

      if (parentRowIndex === -1) return;

      const updatedPlans = plans?.filter(
        (plan) => plan?.article !== row?.article || plan?.id === row?.id
      );
      const updatedPlansWithNewRows = [
        ...updatedPlans.slice(0, parentRowIndex),
        ...newPlans, // The new plans generated
        ...updatedPlans.slice(parentRowIndex + 1),
      ];
      // console.log({ updatedPlans, newPlans, updatedPlansWithNewRows });

      const res = updatedPlansWithNewRows?.map((elem, index) => {
        if (elem?.id == key) {
          return {
            ...elem,
            [type]: val,
          };
        } else {
          return elem;
        }
      });
      // Expand the parent row after the child rows are added
      setPlans(res);
      handleToggleExpand(row.article);
      return;
    }
    let res = plans?.map((elem, index) => {
      if (elem?.id == key) {
        if (type === "start_year") {
          const startYearDiff = val - row?.start_year;

          return {
            ...elem,
            [type]: val,
          };
        }

        return {
          ...elem,
          [type]: type === "default_amount" ? parseInt(val) : val,
        };
      } else if (elem?.article === row?.article) {
        if (type === "start_year" && elem?.start_year) {
          return {
            ...elem,
            start_year: elem.start_year + (val - row?.start_year),
          };
        }
        return elem;
      } else {
        return elem;
      }
    });

    setPlans(res);
  };

  const popoverRef = useRef();
  useEffect(() => {
    getMaintenanceSettings(setMaintenanceSettings);
    const resetCount = () => {
      setActiveStep(null);
    };

    // Attach scroll event listeners
    window.addEventListener("scroll", resetCount);

    const table = document.querySelector(".on_boarding_table");
    if (table) {
      table.addEventListener("scroll", resetCount);
    }

    return () => {
      window.removeEventListener("scroll", resetCount);
      if (table) {
        table.removeEventListener("scroll", resetCount);
      }
    };
  }, []);
  const handleModalClose = () => {
    setData([]);
    setState(null);
    setShowModal(false);
  };
  const handleCloseMaxProperty = () => {
    setShowMaxBuildingModal(false);
    setMaxBuildingMessage("");
  };

  const handleModalShow = async (target) => {
    setShowModal(true);
    setActiveStep(null);
    let val = undefined;
    let res = await api.get(`/u_systems/search/${val}`);
    setSystemCodes(res?.data);
    if (target == "similar" && active?.Alternative_articles_tier_1) {
      setLoader(true);
      let arr = active?.Alternative_articles_tier_1?.split("; ");
      const res = await api.post("/maintaince_items/alternative", arr);
      if (res.status == 200) {
        setData(res.data);
        setTableData(res.data);
        setLoader(false);
      }
    } else if (target == "all") {
      setLoader(true);
      const res = await api.get("/maintaince_items");
      if (res.status == 200) {
        setData(res.data);
        setTableData(res.data);
        setLoader(false);
      }
    }
  };

  const handleCheckRow = (elem) => {
    // console.log({ searchArticle: elem });
    if (selectedRow?._id == elem?._id) {
      setSelectedRow(null);
    } else {
      setSelectedRow(elem);
    }
  };
  const handleReplace = () => {
    let arr = [];
    if (type == "Custom") {
      arr = plans?.map((elem) =>
        elem?.article == active?.article
          ? {
              ...state,
              building_code: building?.build?.building_code,
              property_code: building?.build?.property_code,
              start_year: state?.start_year && state?.start_year,
              prev_year: state?.prev_year && state?.prev_year,
              default_amount: parseInt(state?.default_amount),
              total_cost:
                parseInt(state?.default_amount) *
                parseInt(elem?.price_per_unit),
              tenantId: user?._id,
              key: generateRandomString(7),
              id: Math.floor(Math.random() * 1000000),
            }
          : elem
      );
    } else {
      // debugger;
      const { _id, ...newObj } = selectedRow;
      arr = plans?.map((elem) =>
        elem?.article == active?.article
          ? {
              ...newObj,
              building_code: building?.build?.building_code,
              property_code: building?.build?.property_code,
              start_year: active?.start_year && active?.start_year,
              prev_year: active?.prev_year && active?.prev_year,
              default_amount:
                newObj?.default_amount == "" ? 1 : newObj.default_amount,
              tenantId: user?._id,
              key: generateRandomString(7),
              id: Math.floor(Math.random() * 1000000),
            }
          : elem
      );
    }
    // debugger;
    setPlans(arr);
    setData([]);
    setState(null);
    setShowModal(false);
    setActiveStep(null);
    // setActive(null);
  };
  const handleReplaceGroups = () => {
    // console.log({ active, building });
    let arr = [];
    if (type == "Custom") {
      arr = plans
        ?.map((elem) => {
          if (elem?.article == active?.article) {
            if (elem?.id == active?.id) {
              let currentYear = parseInt(state?.start_year);
              const technicalLife = parseInt(state?.technical_life) || 50;
              const planDuration =
                parseInt(maintenanceSettings?.plan_duration) || 50;
              const newPlans = [];

              const planStartYear = parseInt(
                maintenanceSettings?.plan_start_year
              );
              const planYearsInterval = planStartYear + planDuration;

              // Create new plans based on the technical life and plan duration
              while (
                currentYear < parseInt(state?.start_year) + planDuration &&
                currentYear <= planYearsInterval
              ) {
                newPlans.push({
                  ...state,
                  building_code: building?.build?.building_code,
                  property_code: building?.build?.property_code,
                  name: building?.build?.name,
                  start_year: currentYear,
                  prev_year: state?.prev_year && state?.prev_year,
                  default_amount: parseInt(state?.default_amount),
                  total_cost:
                    parseInt(state?.default_amount) *
                    parseInt(elem?.price_per_unit),
                  tenantId: user?._id,
                  key: generateRandomString(7),
                  id: Math.floor(Math.random() * 1000000),
                });

                currentYear += parseInt(technicalLife);
              }

              return newPlans;
            } else {
              return null;
            }
          } else {
            return elem;
          }
        })
        .filter((item) => item !== null);
    } else {
      //debugger;
      const { _id, ...newObj } = selectedRow;
      arr = plans
        ?.map((elem) => {
          if (elem?.article == active?.article) {
            if (elem?.id == active?.id) {
              let currentYear = parseInt(active?.start_year);
              const technicalLife = parseInt(newObj?.technical_life) || 50;
              const planDuration =
                parseInt(maintenanceSettings?.plan_duration) || 50;
              const newPlans = [];
              const planStartYear = parseInt(
                maintenanceSettings?.plan_start_year
              );
              const planYearsInterval = planStartYear + planDuration;
              while (
                currentYear < parseInt(active?.start_year) + planDuration &&
                currentYear <= planYearsInterval
              ) {
                newPlans.push({
                  ...newObj,
                  building_code: building?.build?.building_code,
                  property_code: building?.build?.property_code,
                  start_year: currentYear,
                  prev_year: active?.prev_year && active?.prev_year,
                  default_amount:
                    newObj?.default_amount == "" ? 1 : newObj.default_amount,
                  tenantId: user?._id,
                  key: generateRandomString(7),
                  id: Math.floor(Math.random() * 1000000),
                  name: building?.build?.name,
                });

                currentYear += parseInt(technicalLife);
              }

              return newPlans;
            } else {
              return null;
            }
          } else {
            return elem;
          }
        })
        .filter((item) => item !== null);
    }
    //debugger;
    const flattenedPlans = arr.flat();
    setPlans(flattenedPlans);
    setData([]);
    setState(null);
    setShowModal(false);
    setActiveStep(null);
    // setActive(null);
  };

  const defaultProps = {
    required: false,
    handleChange: (e) => {
      setState((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    },
  };

  const handleSubmit = () => {};

  const units = ["M2", "ST", "M"];
  const handleNext = async () => {
    // console.log({ plansInSubmit: plans });
    // return;
    let res = plans?.filter((elem) => !elem?.start_year);
    if (res.length > 0) {
      toast("Vänligen välj startår");
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      let array = plans?.map((elem) => {
        return {
          ...elem,
          total_cost:
            typeof elem?.default_amount == "string"
              ? building?.build[elem?.default_amount] * elem?.price_per_unit
              : elem?.default_amount * elem?.price_per_unit,
        };
      });

      let newArr = [];

      await Promise.all(
        array?.map((elem) => {
          if (typeof elem?.default_amount == "number" && elem?.technical_life) {
            let maxYear =
              parseInt(elem?.start_year) + parseInt(elem?.default_amount);
            let startYear =
              parseInt(elem?.start_year) + parseInt(elem?.technical_life);
            // console.log(
            //   startYear,
            //   maxYear,
            //   elem?.default_amount,
            //   elem?.technical_life
            // );
            while (startYear <= maxYear) {
              // console.log("run", startYear, maxYear);
              newArr.push({ ...elem, start_year: startYear });
              startYear = startYear + parseInt(elem?.technical_life);
            }
          }
        })
      );

      // console.log(newArr, "newArr");

      let body;
      if (existProperty) {
        body = { propertiesData: [], maintenancePlan: [...array, ...newArr] };
      } else {
        body = {
          propertiesData: selectPlan == "already" ? [] : properties,
          maintenancePlan: [...array, ...newArr],
        };
        setExistProperty(properties[0]?.property_code);
      }
      body.isFirstLogin = true;
      let res = await api.post(
        `/onboarding/${user?.role == "user" ? user?.tenantId : user?._id}`,
        body
      );
      if (res?.response?.data?.maxUser) {
        setMaxBuildingMessage(res?.response?.data?.message);
        setShowMaxBuildingModal(true);
        return;
      }
      res?.data?._id && localStorage.setItem("user", JSON.stringify(res.data));
      setStopStep(null);
      setStep(5);
    }
  };

  const handleUpgradePlan = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      (user?.plan === "Standard Plus" ||
        user?.plan === "Standard" ||
        user?.cancelSubscriptionDate) &&
      !user?.trialEnd
    ) {
      let res = await api.get(`/stripe/getCustomerPortal/${user?._id}`);
      window.location = res?.data;
    } else {
      let res = await api.patch(`/onboarding/change-status/${user?._id}`);
      res?.data?._id && localStorage.setItem("user", JSON.stringify(res.data));
      console.log("coming in");
      history.push("/pricing-plan");
    }
  };

  const handleSearch = (e) => {
    let uValue = e.target.value.toUpperCase();
    setSearchValue(uValue);
    let val = e.target.value.toLowerCase();
    if (val === "") {
      setData(tableData);
    } else {
      setData(
        tableData?.filter((el) => {
          if (
            el?.article?.toLowerCase()?.includes(val) ||
            el?.maintenance_activity?.toLowerCase()?.includes(val)
          ) {
            return el;
          }
        })
      );
    }
  };

  const [searchValue, setSearchValue] = useState("");

  const CustomInput = ({ value, onClick, disabled, hidePlaceHolder }) => (
    <div
      className={`year_picker_field ${
        disabled && "disabled_year_picker_field"
      }`}
      onClick={(event) => {
        onClick();
        handleDatePickerOpen(event);
      }}
      disabled={disabled}
    >
      {value ? (
        new Date(value).getFullYear()
      ) : hidePlaceHolder ? (
        <div style={{ height: "20px" }}></div>
      ) : (
        t("property_page.Select_Year")
      )}
    </div>
  );

  const CustomFormInput = ({ value, onClick }) => (
    <div className="form_year_picker_field" onClick={onClick}>
      {value ? new Date(value).getFullYear() : t("property_page.Select_Year")}
    </div>
  );

  // State to track expanded rows
  const [expandedRows, setExpandedRows] = useState({});

  // Function to toggle the expanded state for rows with the same article
  const handleToggleExpand = (article) => {
    setExpandedRows((prev) => ({
      ...prev,
      [article]: !prev[article], // Toggle visibility for the article
    }));
  };

  const [groupedPlans, setGroupedPlans] = useState({});
  const [flattenedPlans, setFlattenedPlans] = useState([]);
  const [parentRows, setParentRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: null,
    direction: "none", // 'asc', 'desc', or 'none'
  });
  const [hoveredColumn, setHoveredColumn] = useState(null);
  // useEffect to run when plans change
  useEffect(() => {
    if (plans) {
      // Group plans by article to easily control the expanded state
      const grouped = plans.reduce((acc, plan) => {
        acc[plan.article] = acc[plan.article] || [];
        acc[plan.article].push(plan);
        return acc;
      }, {});

      setGroupedPlans(grouped);

      // Flatten grouped plans into an array, rendering only the first row visible initially, and expanding others
      const flattened = Object.values(grouped).flatMap((group, index) => {
        const mainRow = group[0]; // Only show the first row of the group
        const additionalRows = expandedRows[mainRow.article]
          ? group.slice(1)
          : []; // Show additional rows if expanded
        return [mainRow, ...additionalRows];
      });
      console.log({ grouped, flattened });

      setFlattenedPlans(flattened);
    }
  }, [plans, expandedRows]);
  const [initialValue, setInitialValue] = useState(null);
  const [initialStartYear, setInitialStartYear] = useState(null);

  const handleFocus = (row) => {
    // console.log({ technicFo: row?.technical_life });
    setInitialValue(row?.technical_life);
  };

  const handleBlur = (row) => {
    if (row?.technical_life !== initialValue && row?.start_year) {
      let currentYear = parseInt(row?.start_year);
      const technicalLife = parseInt(row?.technical_life) || 50;
      const planDuration = parseInt(maintenanceSettings?.plan_duration) || 50;
      const newPlans = [];

      const planStartYear = parseInt(maintenanceSettings?.plan_start_year);
      const planYearsInterval = planStartYear + planDuration;

      while (
        currentYear < parseInt(row?.start_year) + planDuration &&
        currentYear <= planYearsInterval
      ) {
        // console.log({ defaultAmount: row?.default_amount });
        newPlans.push({
          ...row,
          building_code: building?.build?.building_code,
          property_code: building?.build?.property_code,
          name: building?.build?.name,
          start_year: currentYear,
          prev_year: row?.prev_year && row?.prev_year,
          default_amount: row?.default_amount || 1,
          total_cost:
            parseInt(row?.default_amount) * parseInt(row?.price_per_unit),
          tenantId: user?._id,
          key: generateRandomString(7),
          id: Math.floor(Math.random() * 1000000),
          technical_life: row?.technical_life,
        });

        currentYear += technicalLife;
      }

      const parentRowIndex = plans?.findIndex((plan) => plan?.id === row?.id);

      if (parentRowIndex === -1) return;

      const updatedPlans = plans?.filter(
        (plan) => plan?.article !== row?.article
      );

      const updatedPlansWithNewRows = [
        ...updatedPlans.slice(0, parentRowIndex),
        ...newPlans,
        ...updatedPlans.slice(parentRowIndex + 0),
      ];
      // console.log({
      //   updatedPlansblur: updatedPlans,
      //   newPlans,
      //   updatedPlansWithNewRows,
      //   parentRowIndex,
      // });

      setPlans(updatedPlansWithNewRows);
    }
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.column === column && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (
      sortConfig.column === column &&
      sortConfig.direction === "desc"
    ) {
      direction = "asc";
    }

    const sorted = customSortWithGrouping(groupedPlans, column, direction);
    setPlans(sorted);
    setSortConfig({ column, direction });
  };

  const customSortWithGrouping = (groupedPlans, column, direction) => {
    const parentRows = Object.values(groupedPlans).map((group) => group[0]);

    const sortedParentRows = parentRows.sort((a, b) => {
      if (direction === "none") return 0;
      if (column === "total_cost") {
        const totalCostA = calculateTotalCost(a);
        const totalCostB = calculateTotalCost(b);

        if (direction === "asc") {
          return totalCostA < totalCostB ? -1 : 1;
        } else if (direction === "desc") {
          return totalCostA > totalCostB ? -1 : 1;
        }
      } else {
        // General sorting for other columns
        if (direction === "asc") {
          return a[column] < b[column] ? -1 : 1;
        } else if (direction === "desc") {
          return a[column] > b[column] ? -1 : 1;
        }
      }
    });

    const sortedRows = [];
    sortedParentRows.forEach((parentRow) => {
      sortedRows.push(parentRow);
      const childRows = groupedPlans[parentRow.article].slice(1);
      sortedRows.push(...childRows);
    });

    return sortedRows;
  };
  const calculateTotalCost = (row) => {
    if (isNaN(row?.default_amount)) {
      return building?.build[row?.default_amount]
        ? parseInt(building?.build[row?.default_amount]) * row?.price_per_unit
        : 0;
    } else {
      return row?.default_amount * row?.price_per_unit;
    }
  };
  const renderSortArrow = (column) => {
    // console.log({ hoveredColumn, column });
    if (sortConfig.column !== column) {
      // Show default arrow on hover when column is not sorted
      return (
        <span
          style={{
            padding: "2px",
            opacity: hoveredColumn === column ? 0.7 : 0,
          }}
        >
          ▼
        </span>
      );
    }

    // Show sorted arrow when the column is sorted
    return sortConfig.direction === "asc" ? (
      <span style={{ paddingLeft: "2px", paddingBottom: "1px" }}>▲</span>
    ) : sortConfig.direction === "desc" ? (
      <span style={{ padding: "2px" }}>▼</span>
    ) : null;
  };
  const [popupPosition, setPopupPosition] = useState({
    top: "50px",
  });

  const handleShowPopup = (row, event) => {
    const rowRect = event.currentTarget.getBoundingClientRect(); // Get the row's position
    const tableRect = document
      .querySelector(".on_boarding_table")
      .getBoundingClientRect(); // Reference to table container

    const popupTop =
      rowRect.top -
      tableRect.top +
      document.querySelector(".on_boarding_table").scrollTop;
    // console.log(
    //   "rowRect",
    //   rowRect,
    //   rowRect.top,
    //   "window.scrollY",
    //   window.scrollY,
    //   "rowRect.top + window.scrollY",
    //   rowRect.top + window.scrollY,
    //   "popupTop",
    //   popupTop,
    //   document.querySelector(".on_boarding_table").scrollTop
    // );
    setPopupPosition({
      top: rowRect.top + 30,
    });
  };
  const adjustDatePickerPosition = (rowRect) => {
    const datePickerPopup = document.querySelector(".react-datepicker-popper");
    if (datePickerPopup && rowRect) {
      // console.log(
      //   { datePickerPopup },
      //   "rowRect.top + window.scrollY",
      //   rowRect.top,
      //   window.scrollY
      // );
      const customClass = "custom-date-picker-position";

      // Add the custom class to the element
      datePickerPopup.classList.add(customClass);

      // Use an existing CSS rule to style the class
      datePickerPopup.style.setProperty(
        "--custom-top",
        `${rowRect.top + 30}px`,
        "important"
      );
      datePickerPopup.style.setProperty(
        "--custom-left",
        `${rowRect.left + window.scrollX}px`,
        "important"
      );
      datePickerPopup.style.position = "fixed";
      datePickerPopup.style.top = `${rowRect.top + window.scrollY}px`;
      datePickerPopup.style.left = `${rowRect.left + window.scrollX}px`;
      datePickerPopup.style.zIndex = 9999;
      datePickerPopup.style.transform = "none"; // Disable transform
      datePickerPopup.style.inset = "unset"; // Disable Popper.js inset styles
      datePickerPopup.style.zIndex = 9999;
    } else {
      console.error("DatePicker popup or rowRect is undefined!");
    }
  };

  const handleDatePickerOpen = (event) => {
    // console.log({ event });
    const rowRect = event?.currentTarget?.getBoundingClientRect(); // Get the row's position
    if (!rowRect) {
      console.error(
        "Could not get the bounding rectangle for the clicked row."
      );
      return;
    }
    setTimeout(() => {
      adjustDatePickerPosition(rowRect);
    }, 0);
  };
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}` : text;
  };

  const getColumnWidth = (defaultWidth, key) => {
    if (windowDimension >= 2880) {
      return "auto";
    }
    if (windowDimension >= 2520) {
      return `${defaultWidth + 100}px`;
    }
    if (windowDimension >= 2420) {
      return `${defaultWidth + 90}px`;
    } else if (windowDimension >= 2300) {
      return `${defaultWidth + 70}px`;
    } else if (windowDimension >= 2200) {
      return `${defaultWidth + 65}px`;
    } else if (windowDimension >= 2100) {
      return `${defaultWidth + 60}px`;
    } else if (windowDimension >= 2000) {
      return `${defaultWidth + 50}px`;
    } else if (windowDimension >= 1920) {
      return `${defaultWidth + 40}px`;
    } else if (windowDimension >= 1770) {
      return `${defaultWidth + 30}px`;
    } else if (windowDimension >= 1580) {
      return `${defaultWidth + 12}px`;
    } else if (windowDimension >= 1500) {
      return `${defaultWidth + 6}px`;
    }
    return `${defaultWidth}px`;
  };

  const getMaxChars = (width, key) => {
    let truncateCharacters;
    if (key === "maintenance_activity") {
      truncateCharacters = Math.floor(width / 12);
    } else {
      truncateCharacters = Math.floor(width / 12);
    }
    // console.log({ truncateCharacters });
    return truncateCharacters;
  };
  const formatCost = (number) => {
    if (!number && number !== 0) return "";
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  const overviewTableColumn = [
    {
      name: (
        <span
          onClick={() => handleSort("u_system")}
          onMouseEnter={() => setHoveredColumn("u_system")}
          onMouseLeave={() => setHoveredColumn(null)}
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          {t("common.pages.SYSTEM")} {renderSortArrow("u_system")}
        </span>
      ),

      cell: (row, index, column, id) => {
        const isExpanded = expandedRows[row.article];
        const group = groupedPlans[row.article];
        const isFirstRowInGroup = group && group.indexOf(row) === 0;

        const text = row?.u_system || "-";
        const columnWidth = getColumnWidth(140, "u_system");
        const maxChars =
          columnWidth === "auto" ? 20 : getMaxChars(parseInt(columnWidth));
        const truncatedText =
          text.length > maxChars ? `${text.substring(0, maxChars)}` : text;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              paddingLeft: isFirstRowInGroup ? "0px" : "60px",
            }}
          >
            {isFirstRowInGroup && (
              <div onClick={() => handleToggleExpand(row.article)}>
                {!isExpanded ? (
                  <MdArrowRight size={24} />
                ) : (
                  <MdArrowDropDown size={24} />
                )}
              </div>
            )}
            {/* <div>{row.u_system}</div> */}

            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${row.id}`}>{row.u_system || ""}</Tooltip>
              }
            >
              <span className="truncated-text">{truncatedText}</span>
            </OverlayTrigger>
          </div>
        );
      },
      width: getColumnWidth(140),
      sortable: false,
      selector: "u_system",
      // sortFunction: (a, b) => customSort(a, b, "u_system"),
    },
    {
      name: t("common.pages.ARTICLE"),
      cell: (row, index, column, id) => {
        const group = groupedPlans[row.article];
        const isFirstRowInGroup = group && group.indexOf(row) === 0;
        // console.log({ row: row?.id, activeStep: activeStep?.id });
        const text = row?.article || "-";
        const columnWidth = getColumnWidth(130, "article");
        const maxChars =
          columnWidth === "auto" ? 30 : getMaxChars(parseInt(columnWidth));
        const truncatedText =
          text.length > maxChars ? `${text.substring(0, maxChars)}` : text;
        return (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "4px",
                cursor: "pointer",
                width: "fit-content",
              }}
              onClick={(event) => {
                if (isFirstRowInGroup) {
                  if (row?.id == activeStep?.id) {
                    setActiveStep(null);
                  } else {
                    handleShowPopup(row, event);
                    setActive(row);
                    setActiveStep(row);
                  }
                }
              }}
            >
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-article-${row.id}`}>
                    {row?.article || ""}
                  </Tooltip>
                }
              >
                <div className="truncated-text">{truncatedText}</div>
              </OverlayTrigger>{" "}
              {isFirstRowInGroup && (
                <span className="material-symbols-outlined">
                  keyboard_arrow_down
                </span>
              )}
            </div>
            <div
              className={` ${row?.id == activeStep?.id ? "" : "hide"}`}
              style={{
                position: "fixed",
                top: popupPosition.top,
                zIndex: 999,
                backgroundColor: "white",
                border: "3px solid #4c505e",
                display: row?.id == activeStep?.id ? "flex" : "none",
                flexDirection: "column",
                rowGap: "1.5rem",
                padding: "1.5rem",
                borderRadius: "10px",
                width: "max-content",
                height: "max-content",
              }}
              ref={popoverRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="similar_articles"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalShow("similar");
                  setType("Similar");
                }}
              >
                {t("common.pages.Show Similar Articles")}
              </div>
              <div
                className="all_articles"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalShow("all");
                  setType("All");
                }}
              >
                {t("common.pages.Search All Articles")}
              </div>
              <div
                className="custom_articles"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalShow("Custom");
                  setType("Custom");
                }}
              >
                {t("common.pages.Submit Custom Articles")}
              </div>
            </div>
          </>
        );
      },
      width: getColumnWidth(130),
    },
    {
      name: (
        <span
          onClick={() => handleSort("maintenance_activity")}
          onMouseEnter={() => setHoveredColumn("maintenance_activity")}
          onMouseLeave={() => setHoveredColumn(null)}
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          {t("common.pages.ACTIVITY")} {renderSortArrow("maintenance_activity")}
        </span>
      ),
      cell: (row, index, column, id) => {
        // Fallback if undefined

        // Truncate text and add ellipsis if it's longer than maxLength

        const text = row?.maintenance_activity || "-";
        const columnWidth = getColumnWidth(260, "maintenance_activity");
        const maxChars =
          columnWidth === "auto"
            ? 30
            : getMaxChars(parseInt(columnWidth), "maintenance_activity");
        const truncatedText =
          text.length > maxChars ? `${text.substring(0, maxChars)}...` : text;
        return (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "4px",
                cursor: "pointer",
                width: "fit-content",
              }}
            >
              <div>
                <div
                  style={{
                    wordBreak: "keep-all",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-article-${row.id}`}>
                        {row?.maintenance_activity || ""}
                      </Tooltip>
                    }
                  >
                    <div className="truncated-text">{truncatedText}</div>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </>
        );
      },
      selector: "property_name",
      width: getColumnWidth(260),
    },
    {
      name: (
        <span
          onClick={() => handleSort("property_code")}
          onMouseEnter={() => setHoveredColumn("property_code")}
          onMouseLeave={() => setHoveredColumn(null)}
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          {t("common.pages.BUILDING")} {renderSortArrow("property_code")}
        </span>
      ),
      cell: (row, index, column, id) => {
        const maxLength = 20;
        const text = row?.building_code || "";

        // Truncate text and add ellipsis if it's longer than maxLength
        const truncatedText =
          text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
        return <span>{truncatedText} </span>;
      },
      sortable: false,
      width: getColumnWidth(120),
      // sortFunction: (a, b) => customSort(a, b, "property_code"),
    },
    {
      name: (
        <span
          onClick={() => handleSort("technical_life")}
          onMouseEnter={() => setHoveredColumn("technical_life")}
          onMouseLeave={() => setHoveredColumn(null)}
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          {t("common.pages.INTERVAL")} {renderSortArrow("technical_life")}
        </span>
      ),
      cell: (row, index, column, id) => {
        const group = groupedPlans[row.article];
        const isFirstRowInGroup = group && group.indexOf(row) === 0;
        return (
          <input
            className={`quantity_field ${
              !isFirstRowInGroup && "disabled_quantity_field"
            }`}
            type="number"
            value={row?.technical_life}
            onChange={(e) => {
              if (isFirstRowInGroup) {
                onChangePlan(row?.id, e.target.value, "technical_life", row);
              }
            }}
            onFocus={() => handleFocus(row)}
            onBlur={() => handleBlur(row)}
          />
        );
      },
      selector: "technical_life",
      sortable: false,
      width: getColumnWidth(110),
      // sortFunction: (a, b) => customSort(a, b, "technical_life"),
    },
    {
      name: (
        <span
          onClick={() => handleSort("start_year")}
          onMouseEnter={() => setHoveredColumn("start_year")}
          onMouseLeave={() => setHoveredColumn(null)}
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          {t("common.pages.START YEAR")} {renderSortArrow("start_year")}
        </span>
      ),
      cell: (row, index, column, id) => {
        const group = groupedPlans[row.article];
        const isFirstRowInGroup = group && group.indexOf(row) === 0;
        return (
          <DatePicker
            closeOnScroll={true}
            showYearPicker
            dateFormat="yyyy"
            selected={row?.start_year && new Date(row?.start_year, 0)}
            value={row?.start_year && row?.start_year.toString()}
            customInput={
              <CustomInput
                value={row?.start_year}
                disabled={!isFirstRowInGroup}
                hidePlaceHolder={true}
              />
            }
            onChange={(e) => {
              onChangePlan(
                row?.id,
                new Date(e).getFullYear(),
                "start_year",
                row
              );
            }}
            disabled={!isFirstRowInGroup}
          />
        );
      },
      selector: "start_year",
      sortable: false,
      width: getColumnWidth(120),

      // sortFunction: (a, b) => customSort(a, b, "start_year"),
    },
    // {
    //   name: (
    //     <span
    //       onClick={() => handleSort("prev_year")}
    //       onMouseEnter={() => setHoveredColumn("prev_year")}
    //       onMouseLeave={() => setHoveredColumn(null)}
    //       style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
    //     >
    //       {t("common.pages.PREV YEAR")} {renderSortArrow("prev_year")}
    //     </span>
    //   ),
    //   cell: (row, index, column, id) => {
    //     const group = groupedPlans[row.article];
    //     const isFirstRowInGroup = group && group.indexOf(row) === 0;
    //     return (
    //       <DatePicker
    //         closeOnScroll={true}
    //         showYearPicker
    //         dateFormat="yyyy"
    //         selected={row?.prev_year && row?.prev_year}
    //         value={row?.prev_year && row?.prev_year.toString()}
    //         customInput={
    //           <CustomInput
    //             value={row?.prev_year}
    //             // disabled={!isFirstRowInGroup}
    //           />
    //         }
    //         onChange={(e) =>
    //           onChangePlan(row?.id, new Date(e).getFullYear(), "prev_year")
    //         }
    //         // disabled={!isFirstRowInGroup}
    //       />
    //     );
    //   },
    //   selector: "prev_year",
    //   sortable: false,
    //   width: "150px",
    //   // sortFunction: (a, b) => customSort(a, b, "prev_year"),
    // },
    {
      name: t("common.pages.QUANTITY"),
      cell: (row, index, column, id) => {
        return (
          <input
            className="quantity_field"
            type="number"
            value={
              typeof row?.default_amount == "string"
                ? building?.build[row?.default_amount]
                : row?.default_amount
            }
            onChange={(e) =>
              onChangePlan(row?.id, e.target.value, "default_amount")
            }
          />
        );
      },
      width: getColumnWidth(110),
    },

    {
      name: (
        <span
          onClick={() => handleSort("unit")}
          onMouseEnter={() => setHoveredColumn("unit")}
          onMouseLeave={() => setHoveredColumn(null)}
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          {t("common.pages.UNIT")} {renderSortArrow("unit")}
        </span>
      ),
      cell: (row, index, column, id) => {
        return (
          <select
            defaultValue={row.unit}
            className="select_option"
            onChange={(e) => onChangePlan(row?.id, e.target.value, "unit")}
          >
            <option>M</option>
            <option>M2</option>
            <option>ST</option>
          </select>
        );
      },
      selector: "unit",
      sortable: false,
      width: getColumnWidth(80),

      // sortFunction: (a, b) => customSort(a, b, "unit"),
    },
    {
      name: (
        <span
          onClick={() => handleSort("price_per_unit")}
          onMouseEnter={() => setHoveredColumn("price_per_unit")}
          onMouseLeave={() => setHoveredColumn(null)}
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          {t("common.pages.UNIT PRICE")} {renderSortArrow("price_per_unit")}
        </span>
      ),
      cell: (row, index, column, id) => {
        return (
          <input
            className="price_field"
            type="number"
            value={row?.price_per_unit}
            onChange={(e) =>
              onChangePlan(row?.id, e.target.value, "price_per_unit")
            }
          />
        );
      },
      selector: "price_per_unit",
      sortable: false,
      width: getColumnWidth(115),

      // sortFunction: (a, b) => customSort(a, b, "price_per_unit"),
    },
    {
      name: (
        <span
          onClick={() => handleSort("total_cost")}
          onMouseEnter={() => setHoveredColumn("total_cost")}
          onMouseLeave={() => setHoveredColumn(null)}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            // width: "152px",
            justifyContent: "start",
          }}
        >
          {t("common.pages.TOTAL COST")} {renderSortArrow("total_cost")}
        </span>
      ),
      cell: (row, index, column, id) => {
        const cost = isNaN(row?.default_amount)
          ? building?.build[row?.default_amount] &&
            parseInt(building?.build[row?.default_amount]) * row?.price_per_unit
          : row?.default_amount * row?.price_per_unit;
        return (
          <span
            style={{
              // width: "130px",
              textAlign: "left",
              fontSize: "16px",
            }}
          >
            {formatCost(cost)}
          </span>
        );
      },
      selector: (row) => {
        return isNaN(row?.default_amount)
          ? building?.build[row?.default_amount] &&
              parseInt(building?.build[row?.default_amount]) *
                row?.price_per_unit
          : row?.default_amount * row?.price_per_unit;
      },
      sortable: false,
      width: getColumnWidth(152),
    },
    {
      width: "60px",
      fixed: "right",
      cell: (row, index, column, id) => {
        const group = groupedPlans[row.article];
        const isFirstRowInGroup = group && group.indexOf(row) === 0;
        return (
          <div
            style={{
              position: "sticky",
              right: 0,
            }}
          >
            <MdDeleteOutline
              size={26}
              cursor="pointer"
              color="#333F50"
              onClick={() => handleDelete(row, isFirstRowInGroup)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <span
        className="material-symbols-outlined step_arrow_back"
        onClick={() => {
          setStopStep("planCover");
          setPlans([]);
        }}
      >
        arrow_back
      </span>
      <div className="maintenance_main">
        <p className="maintenance_plan_head">
          {t("common.pages.Adjust values where necessary")}
        </p>
        <div style={{ margin: "0rem 1rem" }}>
          <DataTable
            data={flattenedPlans}
            columns={overviewTableColumn}
            noDataComponent={t("common.pages.There are no records to display")}
            highlightOnHover
            responsive
            pagination
            className=" on_boarding_table"
            paginationComponentOptions={{
              rowsPerPageText: t("planning_page.rows_per_page"),
            }}
            style={{ overflow: "visible" }}
          />
        </div>

        <div className="step1_submit_btn_main step_4continue next_step_btn">
          <Button
            className="step1_started_btn"
            // onClick={() => setStopStep("planCard")}
            onClick={handleNext}
            style={{ marginBottom: "1rem" }}
          >
            {t("common.pages.Continue")}
          </Button>
        </div>
        <Modal show={showModal} onHide={handleModalClose} size="lg">
          <Modal.Header closeButton style={{ background: "#333F50" }}>
            <Modal.Title className="replace_heading">
              {type == "Similar"
                ? t("planning_page.Replace_with_Similar_Articles")
                : type == "All"
                ? t("planning_page.Search_Articles")
                : t("planning_page.Submit_Custom_Article")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {type == "Custom" ? (
              <div>
                <Form
                  onSubmit={(e) => {
                    handleSubmit(e, state);
                  }}
                >
                  <Row>
                    <InputBoxDropDown
                      mdCol={4}
                      value={state?.u_system}
                      text={"System*"}
                      id={"u_system"}
                      result={(handleClose) =>
                        systemCodes?.map((item) => (
                          <li
                            onClick={(e) => {
                              setState((prev) => ({
                                ...prev,
                                u_system: item.system_code.toUpperCase(),
                              }));
                              handleClose();
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {item.system_code}
                          </li>
                        ))
                      }
                    />
                    <InputBox
                      md={4}
                      {...defaultProps}
                      text={t("planning_page.Article")}
                      id={"article"}
                      value={state?.article}
                    />
                    <InputBox
                      {...defaultProps}
                      mdCol={4}
                      text={t("planning_page.Activity")}
                      id={"maintenance_activity"}
                      value={state?.maintenance_activity}
                    />
                  </Row>
                  <Row>
                    <InputBox
                      {...defaultProps}
                      mdCol={4}
                      text={t("planning_page.Interval")}
                      id={"technical_life"}
                      value={state?.technical_life}
                    />

                    <Col md={4}>
                      <div>{t("planning_page.start_year")}</div>
                      <DatePicker
                        showYearPicker
                        dateFormat="yyyy"
                        selected={state?.start_year && state?.start_year}
                        value={
                          state?.start_year && state?.start_year.toString()
                        }
                        customInput={
                          <CustomFormInput value={state?.start_year} />
                        }
                        onChange={(e) => {
                          setState((prev) => ({
                            ...prev,
                            start_year: new Date(e).getFullYear(),
                          }));
                        }}
                      />
                    </Col>

                    <Col md={4}>
                      <div>{t("planning_page.Prev_year")}</div>
                      <DatePicker
                        showYearPicker
                        dateFormat="yyyy"
                        selected={state?.prev_year && state?.prev_year}
                        value={state?.prev_year && state?.prev_year.toString()}
                        customInput={
                          <CustomFormInput value={state?.prev_year} />
                        }
                        onChange={(e) => {
                          setState((prev) => ({
                            ...prev,
                            prev_year: new Date(e).getFullYear(),
                          }));
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <InputBox
                      {...defaultProps}
                      mdCol={4}
                      text={t("property_page.Quantity")}
                      id={"default_amount"}
                      value={state?.default_amount}
                    />

                    <InputBoxDropDown
                      mdCol={4}
                      value={state?.unit}
                      text={t("property_page.Unit")}
                      id={"unit"}
                      result={(handleClose) =>
                        units?.map((item) => (
                          <li
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setState((prev) => ({
                                ...prev,
                                unit: item,
                              }));
                              handleClose();
                            }}
                          >
                            {item}
                          </li>
                        ))
                      }
                    />

                    <InputBox
                      {...defaultProps}
                      mdCol={4}
                      text={t("property_page.Unit_Price")}
                      id={"price_per_unit"}
                      value={state?.price_per_unit}
                    />
                  </Row>
                </Form>
              </div>
            ) : (
              <>
                {type == "All" && (
                  <Form.Control
                    type="text"
                    placeholder={t("common.pages.search")}
                    value={searchValue}
                    onChange={(e) => handleSearch(e)}
                    style={{ width: "17rem", marginBottom: "1rem" }}
                  />
                )}
                {loader ? (
                  <div
                    style={{
                      height: "70vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        margin: "auto",
                        width: "770px",
                      }}
                    >
                      <Loader />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      maxHeight: "100vh",
                      overflowY: "auto",
                    }}
                  >
                    <Table bordered hover>
                      <thead>
                        <tr>
                          <th></th>
                          <th>System</th>
                          <th>{t("planning_page.Article")}</th>
                          <th> {t("planning_page.Activity")} </th>
                          <th> {t("planning_page.Interval")} </th>
                          <th> {t("planning_page.Unit_Price")} </th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.length > 0 &&
                          data?.map((elem, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <input
                                    type="checkbox"
                                    style={{ transform: "scale(1.2)" }}
                                    checked={
                                      elem?._id == selectedRow?._id
                                        ? true
                                        : false
                                    }
                                    onChange={() => handleCheckRow(elem)}
                                  />
                                </td>
                                <td>{elem?.u_system}</td>
                                <td>{elem?.article}</td>
                                <td
                                  style={{
                                    position: "relative",
                                    maxWidth: "150px",
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {elem?.maintenance_activity}
                                </td>
                                <td>{elem?.technical_life}</td>
                                <td>{elem?.price_per_unit}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="replace_btn_footer_main">
            <Button
              onClick={handleModalClose}
              variant="light"
              className="replace_cancel_btn"
            >
              {t("planning_page.Cancel")}
            </Button>
            {type == "Custom" ? (
              <Button
                onClick={() => {
                  state?.start_year
                    ? handleReplaceGroups()
                    : toast.error("Start year is required!");
                }}
                disabled={state == null ? true : false}
                className="replace_cancel_btn replace_artricle_btn"
                type="button"
              >
                {t("planning_page.Replace_Article")}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (active?.start_year) {
                    handleReplaceGroups();
                  } else {
                    handleReplace();
                  }
                }}
                disabled={selectedRow == null ? true : false}
                className="replace_cancel_btn replace_artricle_btn"
                type="button"
              >
                {t("planning_page.Replace_Article")}
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* Maximum Buildings Modal  */}
        <Modal
          show={showMaxBuildingModal}
          onHide={handleCloseMaxProperty}
          centered
          className="email_verification_modal_main"
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Plan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {maxBuildingMessage}
            {maxBuildingMessage !==
              "You cannot add more than 50 buildings!" && (
              <div className="update_btn_main">
                {user?.role !== "user" && (
                  // <a href="/pricing-plan" target="_blank">
                  <Button
                    variant="primary"
                    onClick={handleUpgradePlan}
                    className="update_btn_change_plan mt-2"
                  >
                    Upgrade Plan
                  </Button>
                  // </a>
                )}
              </div>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default PlanTable;
