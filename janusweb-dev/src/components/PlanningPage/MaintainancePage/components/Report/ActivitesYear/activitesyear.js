import { FilterActivitesYear, FilterReportesPerType } from "lib/PlanningLib";
import React, { useEffect, useRef, useState } from "react";
import Loader from "components/common/Loader";
import { Dropdown, Table } from "@themesberg/react-bootstrap";
import "./activitesYear.css";
import api from "api";
import leaf_icon from "../../../../../../assets/img/report/icon_leaf.png";
import money_icon from "../../../../../../assets/img/report/icon_money.png";
import risk_icon from "../../../../../../assets/img/report/icon_risk major.png";
import project_icon from "../../../../../../assets/img/report/icon_project.png";
import search_icon from "../../../../../../assets/img/report/icon_search.png";
import constructionImg from "../../../../../../assets/img/construction.png";

import { FaCaretDown } from "react-icons/fa";
import Filter from "components/common/Filter";
import { BsThreeDots } from "react-icons/bs";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import ActivitesYearSidePanel from "./activitesYearSidePanel";
import { toast } from "react-toastify";
import filesSidePanel from "./filesSidePanel";
import DetailModal from "./detailModal";
import DeleteModal from "./DeleteModal";
import { useReactToPrint } from "react-to-print";
import { useTranslation } from "react-i18next";
import PrintModal from "./PrintModal";
import { Bar, Line } from "react-chartjs-2";
import Analysis from "../../Analysis/Analysis";
import { usePlanningContextCheck } from "context/SidebarContext/PlanningContextCheck";
import { GetAllProperties } from "lib/PropertiesLib";
import {
  contentTexts,
  contentTextsVariables,
  depOptions,
  getAllMaintenanceDiagramData,
  getMaintenanceDepositionData,
  getMaintenanceReport,
  getMaintenanceSettings,
  getUsystems,
  options,
  sortContent,
  uniquePropertyAndBuildings,
} from "utils/MaintenanceReport";
import PrintData from "./PrintData";
import Switch from "../../../../../common/Switch";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NunitoSans from "../../../../../../utils/nunito-font";
import NunitoSansBold from "../../../../../../utils/nunito-font-bold";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit"; // Import fontkit
import axios from "axios";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { useLocation } from "react-router-dom";
// import autoTable from "jspdf-autotable";

const Activitesyear = ({
  printItem,
  createReport,
  handleChangeAction,
  currReprtTab,
}) => {
  const { value } = GetAllProperties(undefined, undefined, true);
  const location = useLocation();
  // Filter State
  const [filterValues, setFilterValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const tableRefs = useRef([]);
  const [printModal, setPrintModal] = useState(false);
  const [printLoader, setPrintLoader] = useState(false);

  // activites year State
  const [maintainancePlan, setMaintainancePlan] = useState([]);
  const [dupMaintainancePlan, setDupMaintainancePlan] = useState([]);
  const [breakIndexs, setBreakIndexs] = useState([]);
  const abortControllerRef = useRef(null);
  const {
    currentTab,
    setSettingsFormData: setFormData,
    settingsFormData: formData,
  } = usePropertyContextCheck();
  // Delete Modal State
  const [show, setShow] = useState(false);

  // Side Panel State
  const [initalVal, setInitalVal] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);

  // Detail Modal State
  const [detailModal, setDetailModal] = useState(false);
  const [switchState, setSwitchState] = useState(false);
  const [calculation, setCalculation] = useState(true);

  const [menuCol, setMenuCol] = useState(true);

  const [printData, setPrintData] = useState(null);
  const [dupPrintData, setDupPrintData] = useState(null);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [depositionData, setDepositionData] = useState(null);
  const [uniquePropsAndBuilds, setUniquePropsAndBuilds] = useState(null);
  const [maintenanceReport, setMaintenanceReport] = useState(null);
  const [maintenanceSettings, setMaintenanceSettings] = useState(null);
  const [Usystems, setUsystems] = useState([]);
  const [pageNumbering, setPageNumbering] = useState({});
  const chartRef = useRef(null);
  const lineChartRef = useRef(null);
  const htmlContentRef = useRef(null);
  const queryParams = new URLSearchParams(location.search);
  const createReportTab = queryParams.get("createReport");

  const [maintananceDiagramData, setMaintananceDiagramData] = useState({
    labels: [],
    datasets: [],
  });
  const {
    actvsPerTypeBreakIndexs,
    actvsPerTypePrintData,
    setActvsPerYearBreakIndexs,
    setActvsPerYearPrintData,
    setPlanningGroupsByType,
    planningGroupsByType,
  } = usePlanningContextCheck();

  const printRef = useRef();
  const { t, i18n } = useTranslation();
  const depData = {
    labels: depositionData?.depositions?.map((elem) => {
      return elem.deposition_year;
    }),
    datasets: [
      {
        label: t("data_settings.rec_deposition"),
        data: depositionData?.depositions?.map((elem) => {
          return elem.rec_value_fund;
        }),
        backgroundColor: "lightYellow",
        borderColor: "#FF9A25",
        borderWidth: 2,
      },
      {
        label: t("data_settings.current_deposition"),
        data: depositionData?.depositions?.map((elem) => {
          return elem.curr_value_fund;
        }),
        borderColor: "#413F41",
        backgroundColor: "navy",
        borderWidth: 2,
      },
    ],
  };
  useEffect(() => {
    if (createReportTab === "true") {
      setPrintModal(true);
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.delete("createReport");
      // Update the URL
      const newUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : `${window.location.pathname}`;

      window.history.pushState({}, "", newUrl);
    }
  }, []);
  // Delete Modal Function
  const deleteModalClose = () => {
    setInitalVal(null);
    setShow(false);
  };

  const handleShow = (item) => {
    setInitalVal(item);
    setShow(true);
  };

  // Detail Modal Functions
  const detailModalClose = () => setDetailModal(false);
  const detailModalShow = (item) => {
    setInitalVal(item);
    setDetailModal(true);
  };

  const groupMaintenancePlansByBuilding = (maintenancePlans) => {
    // First create a map to group by main system (SC1, SC2, etc)
    const mainSystemMap = maintenancePlans.reduce((acc, item) => {
      // Extract main system ID (SC1, SC2, etc) from item._id
      const mainSystemId = item._id;
      if (!acc[mainSystemId]) {
        acc[mainSystemId] = {
          _id: mainSystemId,
          totalCost: item?.totalCost || 0,
          uSystemName: item?.uSystemName || 0,
          buildings: {},
        };
      }

      // Group documents by building
      item.documents.forEach((doc) => {
        const buildingId = doc.building_details._id;

        if (!acc[mainSystemId].buildings[buildingId]) {
          acc[mainSystemId].buildings[buildingId] = {
            buildingDetails: doc.building_details,
            documents: [],
          };
        }

        // Only add documents where u_system starts with the main system ID
        if (doc.u_system.startsWith(mainSystemId)) {
          acc[mainSystemId].buildings[buildingId].documents.push(doc);
        }
      });

      return acc;
    }, {});

    // Convert the buildings object to array format
    const result = Object.values(mainSystemMap).map((system) => ({
      _id: system._id,
      totalCost: system?.totalCost || 0,
      uSystemName: system?.uSystemName || 0,
      buildings: Object.values(system.buildings),
    }));

    return result;
  };

  const handleFindClick = async () => {
    // perform find logic using filterValues

    let filterObj = {};
    for (const key in filterValues) {
      if (filterValues[key]?.length > 0) {
        filterObj[key] = filterValues[key];
      }
    }
    const res = await FilterActivitesYear({
      body: JSON.stringify({
        filters: filterObj,
      }),
    });
    const newData = await res.json();
    // console.log({ filterObj, printData, newData });

    const response = await FilterReportesPerType({
      body: JSON.stringify({
        filters: filterObj,
      }),
    });
    const allMaintenancePlan = await response.json();
    console.log({ allMaintenancePlan });
    const buildData = groupMaintenancePlansByBuilding(allMaintenancePlan);
    setPlanningGroupsByType(buildData);

    setMaintainancePlan(newData);
    setPrintData(newData);
  };

  const handleSubmit = async (e, data, isCopyItems) => {
    try {
      e.preventDefault();

      if (data?.start_year < 1900 || data?.start_year > 2100) {
        return toast("Start Year Must Be range in 1900 and 2100!", {
          type: "error",
        });
      } else {
        if (isCopyItems) {
          data._id = undefined;
          const res = await api.post(
            "/planning_component/maintainance/activitesPerYear-copy",
            data
          );
        } else {
          let res = await api.patch(
            `/planning_component/maintainance/activitesPerYear-edit/${data._id}`,
            data
          );
          let responseItem = maintainancePlan.map((elem) => {
            if (elem._id == res.data._id) {
              return (elem = res.data);
            } else {
              return elem;
            }
          });
          setMaintainancePlan(responseItem);
        }
        setShowDrawer(!showDrawer);
        setShowSidePanel(false);
      }
    } catch (error) {
      console.error(error);
      toast(error?.response?.data?.message, { type: "error" });
    }
  };

  const handleNewProperty = (item, isCopyItems) => {
    setInitalVal(item);
    setTimeout(() => {
      SidePanelService.open(ActivitesYearSidePanel, {
        handleSubmit,
        initalValue: item,
        isCopyItems,
        handleClose: () => {
          setShowSidePanel(false);
        },
      });
    }, 100);
  };

  const filesModal = (item) => {
    setTimeout(() => {
      setInitalVal(item);
      SidePanelService.open(filesSidePanel, {
        handleSubmit,
        initalVal: item,
        handleClose: () => {
          setShowSidePanel(false);
        },
      });
    }, 100);
  };

  function splitArray(array, chunkSize, elem) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push({ ...elem, documents: array.slice(i, i + chunkSize) });
    }
    return result;
  }

  // function getUniquePropertyCodes(data) {
  //   const result = {};

  //   data.forEach((item) => {
  //     item.documents.forEach((doc) => {
  //       const { property_code, building_code } = doc;
  //       if (!result[property_code]) {
  //         result[property_code] = new Set();
  //       }
  //       result[property_code].add(building_code);
  //     });
  //   });

  //   return Object.keys(result).map((propertyCode) => ({
  //     propertyCode,
  //     buildingCodes: Array.from(result[propertyCode]),
  //   }));
  // }

  const getAllMaintenancePlan = async (spinner) => {
    if (spinner === false) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      let allMaintenancePlan = await api.post(
        "/planning_component/maintainance/activitesPerYear"
      );

      let allData = JSON.parse(JSON.stringify(allMaintenancePlan));
      let indexs = [];
      let updatedData = [];
      let a = 0;
      let sectionCount = 0;
      for (let i = 0; i < allData?.data?.length; i++) {
        if (a === 9 || sectionCount === 4) {
          updatedData.push(allData?.data[i]);
          indexs.push(i);
          a = allData?.data[i]?.documents?.length;
          sectionCount = 1;
        } else if (a + allData?.data[i]?.documents?.length > 9) {
          let remaining = 9 - a;
          let remElem = allData?.data[i]?.documents.splice(0, remaining);
          let splitArrays;
          if (allData?.data[i]?.documents?.length > 9) {
            splitArrays = splitArray(
              allData?.data[i]?.documents,
              9,
              allData?.data[i]
            );
          } else {
            splitArrays = [allData?.data[i]];
          }
          updatedData.push(
            {
              ...allData?.data[i],
              documents: remElem,
            },
            // allData?.data[i]
            ...splitArrays
          );

          indexs.push(updatedData?.length - 1);
          a = updatedData[updatedData?.length - 1]?.documents?.length;
          sectionCount = 1;
          // indexs.push(i + 1);
          // a = allData?.data[i + 1]?.documents?.length;
          // a = 0;
        } else {
          a += allData?.data[i]?.documents?.length;
          sectionCount += 1;
          updatedData.push(allData?.data[i]);
        }
      }

      // let indexs = [];
      // let a = 0;
      // allMaintenancePlan?.data?.map((el, i) => {
      //   if (a + el?.documents?.length > 9) {
      //     indexs.push(i);
      //     a = 0;
      //   } else {
      //     a += el?.documents?.length;
      //   }
      // });
      if (switchState) {
        let percent = formData.vat_percent;
        let updatedPlan = addVAT(allMaintenancePlan?.data, percent);
        let updatedPrintData = addVAT(allMaintenancePlan?.data, percent);
        setMaintainancePlan(updatedPlan);
        setPrintData(updatedPrintData);
        setActvsPerYearPrintData(updatedPrintData);
      } else {
        setMaintainancePlan(allMaintenancePlan.data);
        setPrintData(allMaintenancePlan?.data);
        setActvsPerYearPrintData(allMaintenancePlan?.data);
      }
      setBreakIndexs(indexs);
      setDupPrintData(allMaintenancePlan?.data);
      setDupMaintainancePlan(allMaintenancePlan.data);
      setActvsPerYearBreakIndexs(indexs);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const calculatePercentage = () => {
    let percent = formData?.general_surcharge;
    if (percent) {
      let updatedPlan = maintainancePlan?.map((elem) => {
        return {
          ...elem,
          totalCost: (elem?.totalCost * percent) / 100 + elem?.totalCost,
          documents: elem.documents.map((item) => {
            if (item?.total_cost) {
              return {
                ...item,
                total_cost:
                  (parseInt(item?.total_cost) * percent) / 100 +
                  parseInt(item?.total_cost),
              };
            } else {
              return item;
            }
          }),
        };
      });
      //debugger;
      // let yearlyIncrease = 0;
      updatedPlan = updatedPlan?.map((elem) => {
        if (
          elem?._id > formData?.base_year_increase &&
          formData?.yearly_increase
        ) {
          // yearlyIncrease = yearlyIncrease + formData?.yearly_increase;
          let total_cost = elem?.totalCost;
          let factor = formData?.yearly_increase / 100 + 1;
          let differenece = elem?._id - formData?.base_year_increase;

          let result = Math.pow(factor, differenece);
          // console.log(elem, "elem");
          // console.log(result, "result");
          return {
            ...elem,
            totalCost: result * total_cost,
            documents: elem.documents.map((item) => {
              if (item?.total_cost) {
                total_cost = item?.total_cost;
                factor = formData?.yearly_increase / 100 + 1;
                differenece = elem?._id - formData?.base_year_increase;
                result = Math.pow(factor, differenece);
                return {
                  ...item,
                  total_cost: result * total_cost,
                };
              } else {
                return item;
              }
            }),
          };
        } else {
          return elem;
        }
      });

      setMaintainancePlan(updatedPlan);
      setDupMaintainancePlan(updatedPlan);
      setPrintData(updatedPlan);
    }
  };

  // const getImageAsBase64 = async (imageUrl) => {
  //   try {
  //     const response = await axios.get(imageUrl, {
  //       responseType: "arraybuffer",
  //     });
  //     const blob = new Blob([response.data], { type: "image/png" });
  //     console.log(blob, "blob");
  //     return new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => resolve(reader.result);
  //       reader.readAsDataURL(blob);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const fun = async () => {
  //   let imgData = await getImageAsBase64(
  //     "https://janus-uploads.s3.eu-north-1.amazonaws.com/1727537704707-nodejs.png"
  //   );
  //   console.log(imgData);
  // };

  // useEffect(() => {
  //   fun();
  // }, []);

  useEffect(() => {
    if (formData && maintainancePlan.length > 0 && calculation) {
      // calculatePercentage();
      setCalculation(false);
    }
  }, [formData, maintainancePlan]);

  const getMaintenanceReport = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await api.get(`/maintenance-report/${user?._id}`);
      setMaintenanceReport(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

  // const getAllMaintenanceDiagramData = async () => {
  //   let a = new Date().getFullYear() + 100;
  //   let b = new Date().getFullYear() - 100;

  //   const user = JSON.parse(localStorage.getItem("user"));
  //   setLoading(true);
  //   try {
  //     let allMaintenancePlan = await api.post(
  //       `/planning_component/maintainance/analysis/${user?._id}`
  //     );
  //     setMaintananceDiagramData({
  //       labels: allMaintenancePlan?.data?.labels,
  //       datasets: allMaintenancePlan?.data?.data,
  //     });
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const getMaintenanceDepositionData = async () => {
  //   try {
  //     const userData = JSON.parse(localStorage.getItem("user"));
  //     const res = await api.get(`/maintenance_depositions/${userData._id}`);
  //     setDepositionData(res?.data);
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false);
  //   }
  // };

  // const getMaintenanceSettings = async () => {
  //   try {
  //     const userData = JSON.parse(localStorage.getItem("user"));
  //     const res = await api.get(`/maintenance_settings/${userData._id}`);
  //     setMaintenanceSettings(res?.data);
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false);
  //   }
  // };

  // const uniquePropertyAndBuildings = () => {
  //   let uniqueCodes = getUniquePropertyCodes(maintainancePlan || []);
  //   console.log("uniqueCodes", uniqueCodes);

  //   let propsAndBuilds = [];
  //   uniqueCodes?.map((el) => {
  //     let foundP = value?.find((p) => p?.property_code === el?.propertyCode);
  //     propsAndBuilds.push({
  //       property: foundP,
  //       buildingCodes: el?.buildingCodes,
  //     });
  //   });

  //   console.log("propsAndBuilds", propsAndBuilds);
  //   setUniquePropsAndBuilds(propsAndBuilds);
  // };
  // Function to check if a page is empty

  // Add this helper function at the top level of your component
  const removeFirstPageIfNeeded = (pdf) => {
    if (!selectedPoints.includes("coverPage")) {
      // Get total pages
      const totalPages = pdf.internal.getNumberOfPages();

      // Delete first page
      pdf.deletePage(1);

      // Update page numbers
      for (let i = 1; i < totalPages; i++) {
        pdf.setPage(i);
      }
    }
    return pdf;
  };

  // Add this helper function
  const getAdjustedPageNumber = (pageNum) => {
    // If cover page is not selected, subtract 1 from the page number
    const page = !selectedPoints.includes("coverPage")
      ? pageNum
        ? pageNum - 1
        : ""
      : pageNum;
    return String(page);
  };
  function formatCost(cost) {
    if (typeof cost === "string") {
      // Remove commas and convert to a number if possible
      cost = cost?.replace(/\s+/g, "").replace(/,/g, "");
      cost = parseFloat(cost);
    }

    if (!isNaN(cost)) {
      // Round to the nearest integer
      cost = Math.round(cost);
      // Return the number formatted
      return cost.toLocaleString("sv-SE").replace(/,/g, " ");
    }

    // If the input is invalid, return null or a default value
    return 0;
  }
  // console.log({ printData, planningGroupsByType });
  const genratePdf = async (target) => {
    try {
      // return;
      setPrintLoader(true);
      // Create new AbortController for this generation
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      const pdfPromise = new Promise(async (resolve, reject) => {
        try {
          // Check if aborted
          if (signal.aborted) {
            throw new Error("PDF generation cancelled");
          }

          let pdf = new jsPDF({ orientation: "portrait", compress: true });

          // Add event listener for abort signal
          signal.addEventListener("abort", () => {
            reject(new Error("PDF generation cancelled"));
          });

          pdf.addFileToVFS("NunitoSans-Regular.ttf", NunitoSans);
          pdf.addFont("NunitoSans-Regular.ttf", "NunitoSans", "normal");

          pdf.addFileToVFS("NunitoSans-Bold.ttf", NunitoSansBold); // Assuming NunitoSansBold contains base64 data of the bold font
          pdf.addFont("NunitoSans-Bold.ttf", "NunitoSans", "bold");
          pdf.setFont("Nunito", "normal");

          let property_page_num = 0;
          let activities_year_page_num = 0;
          let activites_system_page_num = 0;
          let maintainenace_diagram_page_num = 0;
          let deposition_diagram_page_num = 0;
          let tableOfContentAdded = false;
          const header = () => {
            const pageWidth = pdf.internal.pageSize.width; // Get the page width
            const margin = 24; // Set a consistent margin from the right
            const organizationText = user?.organization || ""; // Organization name
            const headerTitle = "Underhållsplan"; // Fixed header title text

            pdf.setFont("NunitoSans", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(100);

            // Calculate the width of the longest text
            const headerTextWidth = pdf.getTextWidth(headerTitle);
            const organizationTextWidth = pdf.getTextWidth(organizationText);
            const maxWidth = Math.max(headerTextWidth, organizationTextWidth);

            const rightAlignStartX = pageWidth - margin - maxWidth; // Calculate the starting X position

            // Align the header title and organization name to the same starting X point
            pdf.text(headerTitle, rightAlignStartX, 8); // Header title
            pdf.setFont("NunitoSans", "bold");
            pdf.setFontSize(14);
            pdf.text(organizationText, rightAlignStartX, 13); // Organization name

            // Draw horizontal line for the header separator
            pdf.setLineWidth(0.1);
            pdf.setDrawColor(124, 124, 124);
            pdf.line(9, 18, pageWidth - 9, 18); // Horizontal header line
          };

          // Add footer content (without HTML)
          const footer = (pageNumber) => {
            pdf.setFont("NunitoSans", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(128, 128, 128);
            pdf.line(
              9,
              pdf.internal.pageSize.height - 22,
              pdf.internal.pageSize.width - 9,
              pdf.internal.pageSize.height - 22
            ); // Horizontal line
            let footerText = t(
              "common.pages.This maintenance plan was created with the web application JANUS."
            );
            pdf.text(footerText, 43, pdf.internal.pageSize.height - 14);
            footerText = t("common.pages.More details at");
            pdf.text(footerText, 62, pdf.internal.pageSize.height - 9);
            // Set text color to blue for the URL
            pdf.setTextColor(153, 153, 255);
            const displayText = "www.dinunderhallsplan.se";
            const link = "https://dinunderhallsplan.se";

            const urlX = footerText.length > 15 ? 93.5 : 86.5;
            pdf.text(displayText, urlX, pdf.internal.pageSize.height - 9);

            pdf.link(
              urlX,
              pdf.internal.pageSize.height - 13,
              pdf.getTextWidth(displayText),
              5,
              {
                url: link,
              }
            );
          };

          const addSecondPageContent = () => {
            // Add title
            header();
            footer();

            // Title - Left aligned
            pdf.setFontSize(18);
            pdf.setFont("NunitoSans", "normal");
            pdf.setTextColor(64, 64, 64);
            pdf.text(t("property_page.Table_of_content"), 10, 40); // Align to left with x=7

            // Dynamic content with dotted underline
            pdf.setFontSize(12);
            pdf.setFont("NunitoSans", "normal");
            pdf.setLineWidth(0.2); // Set thin line for dotted underline
            let yOffset = 60; // Initial Y offset for the first item
            const lineYOffsetAdjust = 2; // Adjust for the line to appear below the text

            selectedPoints.forEach((el) => {
              if (contentTexts.includes(el)) {
                const textContent = contentTextsVariables[el]; // Get the value from variables
                const translatedKey = t(`property_page.${textContent}`); // Construct dynamic translation key
                const rawPageNumber =
                  el == "propertyAndBuildingData"
                    ? `${property_page_num || ""}`
                    : el == "maintenanceActivitiesPerYear"
                    ? `${activities_year_page_num || ""}`
                    : el == "maintenanceActivitiesPerSystem"
                    ? `${activites_system_page_num || ""}`
                    : el == "maintenanceDiagram"
                    ? `${maintainenace_diagram_page_num || ""}`
                    : el == "depositionsDiagram"
                    ? `${deposition_diagram_page_num || ""}`
                    : `${pageNumbering[el]}`;

                pdf.text(translatedKey, 10, yOffset);
                // Adjust the page number based on whether cover page is selected
                let pageNumber = rawPageNumber;
                if (
                  el !== "planSettings" &&
                  el !== "myCustomText" &&
                  !selectedPoints.includes("coverPage")
                ) {
                  pageNumber = getAdjustedPageNumber(rawPageNumber);
                }

                // Page number (right aligned)
                const pageNumX = pdf.internal.pageSize.width - 10;
                pdf.text(pageNumber, pageNumX, yOffset, { align: "right" });

                // Dotted line spanning from content to page number
                const dotsStartX = 10; // Start at the beginning of the content text
                const dotsEndX = pageNumX; // End at the beginning of the page number
                let currentX = dotsStartX;

                while (currentX < dotsEndX) {
                  pdf.line(
                    currentX,
                    yOffset + lineYOffsetAdjust,
                    currentX + 1, // Shorter dot length
                    yOffset + lineYOffsetAdjust
                  ); // Dots (short lines)
                  currentX += 2; // Smaller gap between dots
                }

                yOffset += 12; // Line spacing for consistent layout
              }
            });
          };

          const addThirdPageContent = () => {
            // Applied Filters
            header();
            footer();

            // Plan Settings Title
            pdf.setFontSize(18);
            pdf.setFont("NunitoSans", "normal");
            pdf.setTextColor(0, 0, 0);
            let text = `Plan ${t("property_page.Settings")}`;
            pdf.text(text, 10, 40);

            const settings = [
              { label: "Namn", value: maintenanceSettings?.version_name },
              { label: "Startår", value: maintenanceSettings?.plan_start_year },
              { label: "Längd, år", value: maintenanceSettings?.plan_duration },
              {
                label: "Generellt påslag, %",
                value: maintenanceSettings?.general_surcharge,
              },
              { label: "Moms, %", value: maintenanceSettings?.vat_percent },
              {
                label: "Årlig uppräkning, %",
                value: maintenanceSettings?.yearly_increase,
              },
              {
                label: "Basår index",
                value: maintenanceSettings?.base_year_increase || "-",
              },
            ];

            // Filter key to label mapping for translation
            const filterLabelMapping = {
              start_year: "Start Year",
              u_system: "System Code",
              status: "Status",
              article: "Article",
              flag: "Flags",
              properties: "Properties",
            };

            // Add Applied Filters row to settings
            const appliedFilters =
              Object.keys(filterValues)?.length > 0
                ? Object.keys(filterValues)
                    ?.map((key) => {
                      const filterValuesList = filterValues[key];
                      if (filterValuesList.length > 0) {
                        const translatedKey = t(
                          `report.${filterLabelMapping[key] || key}`
                        ); // Use translation for key
                        const values = filterValuesList.join(", ");
                        return `${translatedKey}: ${values}`;
                      }
                      return null;
                    })
                    .filter((filter) => filter !== null)
                    .join("\n")
                : ""; // Combine all filters into a formatted string
            Object.keys(filterValues)?.length > 0 &&
              settings.push({
                label: t("report.Applied Filters"),
                value: appliedFilters,
              });

            const rectWidth = pdf.internal.pageSize.width - 6 - 10;
            let settingsOffset = 60;
            settings.forEach((setting, i) => {
              pdf.setFontSize(12);
              pdf.setFont("NunitoSans", "normal");

              const valueLines = pdf.splitTextToSize(
                setting.value,
                rectWidth - 75
              ); // Wrap text in value column
              const rowHeight = 10 + (valueLines.length - 1) * 5; // Calculate row height dynamically

              // Set light gray background for the keys column
              pdf.setFillColor(211, 211, 211); // Light gray color
              pdf.rect(10, settingsOffset - 6, 67, rowHeight, "F");

              // Set white background for the values column
              pdf.setFillColor(255, 255, 255); // White color
              pdf.rect(75, settingsOffset - 6, rectWidth - 73, rowHeight, "F");

              // Draw light gray borders around each key-value pair
              pdf.setDrawColor(200, 200, 200); // Light gray color for border
              pdf.rect(10, settingsOffset - 6, rectWidth - 3, rowHeight, "S"); // Outer border for each row

              // Add the text
              pdf.setTextColor(0, 0, 0); // Set text color to black
              pdf.text(setting.label, 11, settingsOffset); // Key

              valueLines.forEach((line, lineIndex) => {
                pdf.text(line, 77, settingsOffset + lineIndex * 5); // Render each line in the value column
              });
              settingsOffset += rowHeight; // Adjust offset for the next row
            });
          };

          const addFourthPageContent = () => {
            header();
            pdf.setFontSize(18);
            pdf.setFont("NunitoSans", "normal");
            pdf.setTextColor(64, 64, 64);
            pdf.text(t("property_page.Property_and_building_data"), 105, 34, {
              align: "center",
            });

            let currentPage = pdf.internal.getNumberOfPages();
            property_page_num = currentPage + 1;
            pdf.autoTable({
              startY: 40,
              head: [
                [
                  t("property_page.Legal Name").toUpperCase(),
                  t("common.pages.Address").toUpperCase(),
                  "AREA BOA",
                  t("property_page.buildings").toUpperCase(),
                ],
              ],
              body:
                filterValues?.properties && filterValues?.properties.length > 0
                  ? filterValues?.properties.map((el) => {
                      let pfound = value?.find((p) => p?.name === el);
                      return [
                        pfound?.legal_name || "",
                        pfound?.street_address || "",
                        pfound?.sum_area_boa || "",
                        pfound?.buildingCodes?.join(", ") || "",
                      ];
                    })
                  : value?.map((el) => [
                      el?.legal_name || "",
                      el?.street_address || "",
                      el?.sum_area_boa || "",
                      el?.buildingCodes?.join(", ") || "",
                    ]),
              styles: {
                fillColor: "white",
                textColor: "gray",

                font: "NunitoSans",
              },
              margin: { left: 9 }, // Align table to the left where the header line starts
              tableWidth: pdf.internal.pageSize.width - 18, // Adjust table width to match the header line width
            });

            footer(4); // Add footer on page 4
          };

          const addFifthPageContent = () => {
            pdf.setFontSize(18);
            pdf.setFont("NunitoSans", "normal");
            let currentPage = pdf.internal.getNumberOfPages();
            activities_year_page_num = currentPage + 1;
            let currentCount = 0;
            let currentPositionHeight = pdf.previousAutoTable.finalY;
            printData?.forEach((elem, index) => {
              currentPositionHeight = pdf.previousAutoTable.finalY;
              let yearY;
              yearY = index > 0 ? pdf?.previousAutoTable.finalY + 5 : 25;

              let year = `${elem?._id}`;
              let status = switchState
                ? t("common.pages.INC. VAT")
                : t("common.pages.EX. VAT");
              let total_cost = `${formatCost(elem?.totalCost)}`;
              pdf.setFontSize(11);
              pdf.setFont("NunitoSans", "normal");
              pdf.setFillColor("#FFFF88");
              let totalArr = [
                {
                  maintenance_activity: year,
                  article: "",
                  u_system: "",
                  technical_life: "",
                  status: status,
                  total_cost: total_cost,
                },
              ];

              if (currentPositionHeight > 245) {
                pdf.addPage();
                pdf.previousAutoTable.finalY = 25;
                currentPositionHeight = 25;
              }
              autoTable(pdf, {
                startY: index > 0 ? pdf.previousAutoTable.finalY + 5 : yearY,
                head: totalArr?.map((item) => [
                  item.maintenance_activity,
                  "         ",
                  "         ",
                  "         ",
                  "         ",
                  {
                    content: formatCost(item?.total_cost),
                    styles: { halign: "right" },
                  },
                ]),
                body: [],
                headStyles: {
                  fontSize: 12,
                  fontWeight: "normal",
                },
                columnStyles: {
                  0: { cellWidth: 65 },
                  1: { cellWidth: 30 },
                  2: { cellWidth: 30 },
                  3: { cellWidth: 30 },
                  4: { cellWidth: 30 },
                  5: { cellWidth: 65, halign: "righ" },
                },
                styles: {
                  fillColor: "#C0C0C0",
                  textColor: "black",
                  font: "NunitoSans",
                },
                margin: { left: 9 }, // Align table to the left where the header line starts
                tableWidth: pdf.internal.pageSize.width - 18, // Adjust table width to match the header line width
              });
              const pageHeight = pdf.internal.pageSize.height; // Get the page height
              const marginBottom = 25; // Define a bottom margin
              const endY = pageHeight - marginBottom;
              currentPositionHeight = pdf.previousAutoTable.finalY;

              let array = elem?.documents;
              let array1 = [];
              let array2 = [];
              let space = 0;
              let seventhCount = 0;
              let eightCount = 0;
              let ninethCount = 0;
              let tenthCount = 0;

              elem?.documents?.map((el) => {
                if (el?.maintenance_activity?.length < 10) {
                  space = space + 7;
                  seventhCount = seventhCount + 1;
                }
                if (el?.maintenance_activity?.length > 20) {
                  space = space + 10;
                  tenthCount = tenthCount + 1;
                } else if (
                  el?.maintenance_activity?.length > 10 &&
                  el?.maintenance_activity?.length < 20
                ) {
                  space = space + 9;
                  eightCount = eightCount + 1;
                } else {
                  space = space + 13;
                  ninethCount = ninethCount + 1;
                }
              });
              // if (space + currentPositionHeight > 250) {
              let availableSpace = 270 - currentPositionHeight;
              let result = seventhCount;
              if (availableSpace > 0) {
                if (
                  ninethCount >= seventhCount &&
                  ninethCount >= eightCount &&
                  ninethCount >= tenthCount
                ) {
                  result = 13; // Corresponds to ninethCount
                } else if (
                  seventhCount >= ninethCount &&
                  seventhCount >= eightCount &&
                  seventhCount >= tenthCount
                ) {
                  result = 7; // Corresponds to seventhCount
                } else if (
                  eightCount >= ninethCount &&
                  eightCount >= seventhCount &&
                  eightCount >= tenthCount
                ) {
                  result = 10; // Corresponds to eightCount
                } else {
                  result = 10; // Corresponds to tenthCount
                }
                let num = Math.trunc(availableSpace / result);
                array1 = array.slice(0, num);
                array2 = array.slice(num);
                // debugger;
              } else {
                array2 = array;
                // debugger;
              }
              // } else {
              //   array1 = array;
              //   debugger;
              // }
              if (array1.length) {
                autoTable(pdf, {
                  startY: pdf.previousAutoTable.finalY,
                  head: [
                    [
                      t("planning_page.activity").toUpperCase(),
                      t("planning_page.article").toUpperCase(),
                      "SYSTEM",
                      t("planning_page.interval").toUpperCase(),
                      "STATUS",
                      "",
                    ],
                  ],
                  body: array1?.map((item) => [
                    item.maintenance_activity,
                    item.article,
                    item.u_system,
                    item.technical_life
                      ? item.technical_life + " " + t("property_page.year")
                      : "-",
                    item.status,
                    formatCost(item?.total_cost),
                  ]),
                  columnStyles: {
                    0: { cellWidth: 60, valign: "middle" },
                    1: { cellWidth: 31, valign: "middle" },
                    2: { cellWidth: 26, valign: "middle" },
                    3: { cellWidth: 30, valign: "middle" },
                    4: { cellWidth: 25, valign: "middle" },
                    5: {
                      cellWidth: 20,
                      halign: "right",
                      fontStyle: "bold",
                      valign: "middle",
                    },
                  },
                  styles: {
                    fillColor: "white",
                    textColor: "black",
                    fontWeight: "normal",
                    valign: "middle",
                    font: "NunitoSans",
                  },
                  headStyles: {
                    fontSize: 8,
                    // fillColor: "white",
                    fontWeight: "normal",
                    textColor: "#B3B3B3",
                    valign: "middle",
                    font: "NunitoSans",
                  },
                  bodyStyles: {
                    fontSize: 8,
                    fontWeight: "normal",
                    valign: "middle",
                    font: "NunitoSans",
                  },
                  pageBreak: "auto",
                  rowPageBreak: "auto",
                  didDrawPage: (data) => {
                    const currentPage = pdf.internal.getNumberOfPages();

                    if (currentCount !== currentPage) {
                      header(); // Call header function
                      footer(); // Call footer function
                      currentCount = currentPage;
                    }

                    const tableBottomY = pdf.previousAutoTable.finalY;
                    // currentY = tableBottomY + 5;
                    // // Check if the table is about to exceed the page height, and trigger a new page
                    if (
                      tableBottomY >= pageHeight - marginBottom &&
                      data?.row?.index === 0
                    ) {
                      yearY = 35;
                    }
                  },

                  didDrawCell: (data) => {
                    // For the header cell (Cost column)
                    if (data.section === "head" && data.column.index === 5) {
                      const costText = switchState
                        ? t("common.pages.INC. VAT")
                        : t("common.pages.EX. VAT");

                      // Get current language
                      const currentLang = i18n.language; // Assuming you're using i18next

                      // Adjust position based on language
                      const xAdjustment = currentLang === "sv" ? 6 : 0; // Shift left by 3 units for Swedish
                      const xAdjustmentVat = currentLang === "sv" ? 0 : 0.5; // Shift left by 3 units for Swedish
                      const xPosition =
                        data.cell.x + data.cell.width - 10 - xAdjustment;
                      const yPosition = data.cell.y + data.cell.height / 2;

                      // Draw "Cost" text
                      pdf.setFontSize(8);
                      pdf.text(
                        t("planning_page.Cost").toUpperCase(),
                        xPosition,
                        yPosition
                      );

                      // Draw VAT text below "Cost"
                      pdf.setFontSize(5.5); // Smaller font size for VAT text
                      pdf.text(
                        costText,
                        xPosition + xAdjustmentVat,
                        yPosition + 2
                      ); // Adjust Y to move VAT text below
                    }
                  },
                  margin: { left: 9 }, // Align table to the left where the header line starts
                  tableWidth: pdf.internal.pageSize.width - 18, // Adjust table width to match the header line width
                });
              }
              array1 = [];
              if (array2.length > 0) {
                pdf.addPage(); // Add a new page
                pdf.previousAutoTable.finalY = 20;
                currentPositionHeight = 20;
                autoTable(pdf, {
                  startY: 25,
                  // head: [
                  //   [
                  //     t("planning_page.activity").toUpperCase(),
                  //     t("planning_page.article").toUpperCase(),
                  //     "SYSTEM",
                  //     t("planning_page.interval").toUpperCase(),
                  //     "STATUS",
                  //     "",
                  //   ],
                  // ],
                  body: array2?.map((item) => [
                    item.maintenance_activity,
                    item.article,
                    item.u_system,
                    item.technical_life
                      ? item.technical_life + " " + t("property_page.year")
                      : "-",
                    item.status,
                    formatCost(item?.total_cost),
                  ]),
                  columnStyles: {
                    0: { cellWidth: 60, valign: "middle" },
                    1: { cellWidth: 31, valign: "middle" },
                    2: { cellWidth: 26, valign: "middle" },
                    3: { cellWidth: 30, valign: "middle" },
                    4: { cellWidth: 25, valign: "middle" },
                    5: {
                      cellWidth: 20,
                      halign: "right",
                      fontStyle: "bold",
                      valign: "middle",
                    },
                  },
                  styles: {
                    fillColor: "white",
                    textColor: "black",
                    fontWeight: "normal",
                    valign: "middle",
                    font: "NunitoSans",
                  },
                  headStyles: {
                    fontSize: 8,
                    // textColor: "#B3B3B3",
                    fontWeight: "normal",
                    fillColor: "#C0C0C0",
                    valign: "middle",
                    font: "NunitoSans",
                  },
                  bodyStyles: {
                    fontSize: 8,
                    fontWeight: "normal",
                    valign: "middle",
                    font: "NunitoSans",
                  },
                  pageBreak: "auto",
                  rowPageBreak: "auto",
                  didDrawPage: (data) => {
                    const currentPage = pdf.internal.getNumberOfPages();

                    if (currentCount !== currentPage) {
                      header(); // Call header function
                      footer(); // Call footer function
                      currentCount = currentPage;
                    }

                    const tableBottomY = pdf.previousAutoTable.finalY;
                    // currentY = tableBottomY + 5;
                    // // Check if the table is about to exceed the page height, and trigger a new page
                    if (
                      tableBottomY >= pageHeight - marginBottom &&
                      data?.row?.index === 0
                    ) {
                      yearY = 35;
                    }
                  },

                  didDrawCell: (data) => {
                    // For the header cell (Cost column)
                    if (data.section === "head" && data.column.index === 5) {
                      const costText = switchState
                        ? t("common.pages.INC. VAT")
                        : t("common.pages.EX. VAT");

                      // Get current language
                      const currentLang = i18n.language; // Assuming you're using i18next

                      // Adjust position based on language
                      const xAdjustment = currentLang === "sv" ? 6 : 0; // Shift left by 3 units for Swedish
                      const xAdjustmentVat = currentLang === "sv" ? 0 : 0.5; // Shift left by 3 units for Swedish
                      const xPosition =
                        data.cell.x + data.cell.width - 10 - xAdjustment;
                      const yPosition = data.cell.y + data.cell.height / 2;

                      // Draw "Cost" text
                      pdf.setFontSize(8);
                      pdf.text(
                        t("planning_page.Cost").toUpperCase(),
                        xPosition,
                        yPosition
                      );

                      // Draw VAT text below "Cost"
                      pdf.setFontSize(5.5); // Smaller font size for VAT text
                      pdf.text(
                        costText,
                        xPosition + xAdjustmentVat,
                        yPosition + 2
                      ); // Adjust Y to move VAT text below
                    }
                  },
                  margin: { left: 9 }, // Align table to the left where the header line starts
                  tableWidth: pdf.internal.pageSize.width - 18, // Adjust table width to match the header line width
                });
                array2 = [];
              }
            });

            // Footer on page 5
          };

          const renderSixthPagePDF = () => {
            let currentCount = 0;
            pdf.setFont("NunitoSans", "normal");

            const columns = [
              {
                header: t("planning_page.activity").toUpperCase(),
                dataKey: "maintenance_activity",
              },
              {
                header: t("planning_page.article").toUpperCase(),
                dataKey: "article",
              },
              {
                header: t("planning_page.Year").toUpperCase(),
                dataKey: "start_year",
              },
              {
                header: t("planning_page.interval").toUpperCase(),
                dataKey: "technical_life",
              },
              {
                header: t("planning_page.quantity").toUpperCase(),
                dataKey: "quantity",
              },
              {
                header: t("planning_page.unit").toUpperCase(),
                dataKey: "unit",
              },
              {
                header: t("common.pages.Unit_price").toUpperCase(),
                dataKey: "price_per_unit",
              },
              {
                header: {
                  content: t("planning_page.Cost").toUpperCase(),
                  styles: { halign: "right" },
                },
                dataKey: "total_cost",
              },
            ];

            let currentPage = pdf.internal.getNumberOfPages();
            activites_system_page_num = currentPage + 1;

            let currentPositionHeight = pdf.previousAutoTable.finalY;
            planningGroupsByType?.forEach((system, systemIndex) => {
              currentPositionHeight = pdf.previousAutoTable.finalY;
              let systemHeaderY =
                systemIndex > 0 ? pdf.previousAutoTable.finalY + 5 : 25;

              if (currentPositionHeight > 245) {
                pdf.addPage();
                pdf.previousAutoTable.finalY = 20;
                currentPositionHeight = 20;
              }

              autoTable(pdf, {
                head: [
                  [
                    `${system?._id.slice(0, 5)} ${system?.uSystemName || ""}`,
                    "",
                    "",
                    "",
                    "",
                    {
                      content: `${formatCost(system?.totalCost)}`,
                      styles: { halign: "right" },
                    },
                  ],
                ],
                theme: "plain",
                startY:
                  systemIndex > 0
                    ? pdf.previousAutoTable.finalY + 5
                    : systemHeaderY,
                styles: {
                  fillColor: "#C0C0C0",
                  textColor: "black",
                  fontSize: 11.5,
                  fontWeight: "normal",
                  font: "NunitoSans",
                },
                margin: { left: 9 },
                tableWidth: pdf.internal.pageSize.width - 18,
              });

              currentPositionHeight = pdf.previousAutoTable.finalY;

              system.buildings.forEach((building, buildingIndex) => {
                // Subheader for each building
                if (currentPositionHeight > 245) {
                  pdf.addPage();
                  pdf.previousAutoTable.finalY = 20;
                  currentPositionHeight = 20;
                }

                autoTable(pdf, {
                  head: [
                    [
                      `${
                        building?.buildingDetails?.building_code +
                        " " +
                        building?.buildingDetails?.name?.toUpperCase()
                      }`,
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                    ],
                  ],
                  theme: "plain",
                  startY: pdf.previousAutoTable.finalY + 5,
                  styles: {
                    fillColor: [247, 189, 156],
                    textColor: "black",
                    fontSize: 10,
                    fontWeight: "bold",
                    font: "NunitoSans",
                  },
                  margin: { left: 9 },
                  tableWidth: pdf.internal.pageSize.width - 18,
                });

                currentPositionHeight = pdf.previousAutoTable.finalY;

                let array = building.documents;
                let array1 = [];
                let array2 = [];
                let space = 0;
                let seventhCount = 0;
                let eightCount = 0;
                let ninethCount = 0;
                let tenthCount = 0;

                if (array.length > 0) {
                  building?.documents?.forEach((el) => {
                    if (el?.maintenance_activity?.length < 10) {
                      space = space + 7;
                      seventhCount++;
                    }
                    if (el?.maintenance_activity?.length > 20) {
                      space = space + 10;
                      tenthCount++;
                    } else if (
                      el?.maintenance_activity?.length > 10 &&
                      el?.maintenance_activity?.length < 20
                    ) {
                      space = space + 9;
                      eightCount++;
                    } else {
                      space = space + 13;
                      ninethCount++;
                    }
                  });

                  let availableSpace = 245 - currentPositionHeight;
                  let result = 0;
                  if (availableSpace > 0) {
                    if (
                      ninethCount >= seventhCount &&
                      ninethCount >= eightCount &&
                      ninethCount >= tenthCount
                    ) {
                      result = 13;
                    } else if (
                      seventhCount >= ninethCount &&
                      seventhCount >= eightCount &&
                      seventhCount >= tenthCount
                    ) {
                      result = 7;
                    } else if (
                      eightCount >= ninethCount &&
                      eightCount >= seventhCount &&
                      eightCount >= tenthCount
                    ) {
                      result = 9;
                    } else {
                      result = 10;
                    }
                    let num = Math.trunc(availableSpace / 9);
                    array1 = array.slice(0, num);
                    array2 = array.slice(num);
                  } else {
                    array2 = array;
                  }

                  if (array1.length > 0) {
                    autoTable(pdf, {
                      head: [
                        columns.map((col) =>
                          col.dataKey == "total_cost" ? "" : col.header
                        ),
                      ],
                      body: array1.map((row) =>
                        columns.map((col) =>
                          col.dataKey == "flags"
                            ? ""
                            : col.dataKey == "total_cost"
                            ? formatCost(row[col.dataKey])
                            : col.dataKey == "technical_life"
                            ? row[col.dataKey]
                              ? row[col.dataKey] + " " + t("property_page.year")
                              : "-"
                            : row[col.dataKey]
                        )
                      ),
                      startY: pdf.previousAutoTable.finalY,
                      columnStyles: {
                        0: { cellWidth: 54, valign: "middle" },
                        1: { cellWidth: 28, valign: "middle" },
                        2: { cellWidth: 12, valign: "middle" },
                        3: { cellWidth: 25, valign: "middle" },
                        4: { cellWidth: 18, valign: "middle" },
                        5: { cellWidth: 14, valign: "middle" },
                        6: { cellWidth: 21, valign: "middle" },
                        7: {
                          cellWidth: 20,
                          halign: "right",
                          fontStyle: "bold",
                          valign: "middle",
                        },
                      },
                      styles: {
                        fillColor: "white",
                        textColor: "black",
                        fontWeight: "normal",
                        valign: "middle",
                        font: "NunitoSans",
                      },
                      headStyles: {
                        fontSize: 8,
                        fontWeight: "normal",
                        textColor: "#B3B3B3",
                        valign: "middle",
                        font: "NunitoSans",
                      },
                      bodyStyles: {
                        fontSize: 8,
                        fontWeight: "normal",
                        valign: "middle",
                        font: "NunitoSans",
                      },
                      didDrawPage: (data) => {
                        const currentPage = pdf.internal.getNumberOfPages();

                        if (currentCount !== currentPage) {
                          header(); // Call header function
                          footer(); // Call footer function
                          currentCount = currentPage;
                        }
                      },
                      didDrawCell: (data) => {
                        // For the header cell (Cost column)
                        if (
                          data.section === "head" &&
                          data.column.index === 7
                        ) {
                          const costText = switchState
                            ? t("common.pages.INC. VAT")
                            : t("common.pages.EX. VAT");

                          // Get current language
                          const currentLang = i18n.language; // Assuming you're using i18next

                          // Adjust position based on language
                          const xAdjustment = currentLang === "sv" ? 6 : 0; // Shift left by 3 units for Swedish
                          const xAdjustmentVat = currentLang === "sv" ? 0 : 0.5; // Shift left by 3 units for Swedish
                          const xPosition =
                            data.cell.x + data.cell.width - 10 - xAdjustment;
                          const yPosition = data.cell.y + data.cell.height / 2;

                          // Draw "Cost" text
                          pdf.setFontSize(8);
                          pdf.text(
                            t("planning_page.Cost").toUpperCase(),
                            xPosition,
                            yPosition
                          );

                          // Draw VAT text below "Cost"
                          pdf.setFontSize(5.5); // Smaller font size for VAT text
                          pdf.text(
                            costText,
                            xPosition + xAdjustmentVat,
                            yPosition + 2
                          ); // Adjust Y to move VAT text below
                        }
                      },
                      margin: { left: 9, top: 20 },
                      tableWidth: pdf.internal.pageSize.width - 18,
                    });
                  }

                  if (array2.length > 0) {
                    pdf.addPage();
                    pdf.previousAutoTable.finalY = 20;
                    currentPositionHeight = 20;

                    autoTable(pdf, {
                      body: array2.map((row) =>
                        columns.map((col) =>
                          col.dataKey == "technical_life"
                            ? row[col.dataKey]
                              ? row[col.dataKey] + " " + t("property_page.year")
                              : "-"
                            : col.dataKey == "total_cost"
                            ? formatCost(row[col.dataKey])
                            : row[col.dataKey]
                        )
                      ),
                      startY: 25,

                      columnStyles: {
                        0: { cellWidth: 54, valign: "middle" },
                        1: { cellWidth: 28, valign: "middle" },
                        2: { cellWidth: 12, valign: "middle" },
                        3: { cellWidth: 25, valign: "middle" },
                        4: { cellWidth: 18, valign: "middle" },
                        5: { cellWidth: 14, valign: "middle" },
                        6: { cellWidth: 21, valign: "middle" },
                        7: {
                          cellWidth: 20,
                          halign: "right",
                          fontStyle: "bold",
                          valign: "middle",
                        },
                      },
                      styles: {
                        fillColor: "white",
                        textColor: "black",
                        valign: "middle",
                        font: "NunitoSans",
                      },
                      margin: { left: 9, top: 20 }, // Align table to the left where the header line starts
                      tableWidth: pdf.internal.pageSize.width - 18, // Adjust table width to match the header line width
                      headStyles: {
                        fontSize: 8,
                        fillColor: "#C0C0C0",
                        fontWeight: "normal",
                        valign: "middle",
                        font: "NunitoSans",
                      },
                      bodyStyles: {
                        fontSize: 8,
                        fontWeight: "normal",
                        valign: "middle",
                        font: "NunitoSans",
                      },
                      didDrawPage: (data) => {
                        const currentPage = pdf.internal.getNumberOfPages();

                        if (currentCount !== currentPage) {
                          header(); // Call header function
                          footer(); // Call footer function
                          currentCount = currentPage;
                        }
                      },
                      didDrawCell: (data) => {
                        // For the header cell (Cost column)
                        if (
                          data.section === "head" &&
                          data.column.index === 7
                        ) {
                          const costText = switchState
                            ? t("common.pages.INC. VAT")
                            : t("common.pages.EX. VAT");

                          // Get current language
                          const currentLang = i18n.language; // Assuming you're using i18next

                          // Adjust position based on language
                          const xAdjustment = currentLang === "sv" ? 6 : 0; // Shift left by 3 units for Swedish
                          const xAdjustmentVat = currentLang === "sv" ? 0 : 0.5; // Shift left by 3 units for Swedish
                          const xPosition =
                            data.cell.x + data.cell.width - 10 - xAdjustment;
                          const yPosition = data.cell.y + data.cell.height / 2;

                          // Draw "Cost" text
                          pdf.setFontSize(8);
                          pdf.text(
                            t("planning_page.Cost").toUpperCase(),
                            xPosition,
                            yPosition
                          );

                          // Draw VAT text below "Cost"
                          pdf.setFontSize(5.5); // Smaller font size for VAT text
                          pdf.text(
                            costText,
                            xPosition + xAdjustmentVat,
                            yPosition + 2
                          ); // Adjust Y to move VAT text below
                        }
                      },
                    });
                  }
                }
              });
            });
          };

          // const renderSixthPagePDF = () => {
          //   let currentCount = 0;
          //   pdf.setFont("NunitoSans", "normal");

          //   const columns = [
          //     {
          //       header: t("planning_page.activity").toUpperCase(),
          //       dataKey: "maintenance_activity",
          //     },
          //     {
          //       header: t("planning_page.article").toUpperCase(),
          //       dataKey: "article",
          //     },
          //     {
          //       header: t("planning_page.Year").toUpperCase(),
          //       dataKey: "start_year",
          //     },
          //     {
          //       header: t("planning_page.interval").toUpperCase(),
          //       dataKey: "technical_life",
          //     },
          //     {
          //       header: t("planning_page.quantity").toUpperCase(),
          //       dataKey: "quantity",
          //     },
          //     {
          //       header: t("planning_page.unit").toUpperCase(),
          //       dataKey: "unit",
          //     },
          //     {
          //       header: t("common.pages.Unit_price").toUpperCase(),
          //       dataKey: "price_per_unit",
          //     },
          //     {
          //       header: {
          //         content: t("planning_page.Cost").toUpperCase(),
          //         styles: { halign: "right" },
          //       },
          //       dataKey: "total_cost",
          //     },
          //   ];

          //   let currentPage = pdf.internal.getNumberOfPages();
          //   activites_system_page_num = currentPage;

          //   // Add a new page (6th page)
          //   let currentPositionHeight = pdf.previousAutoTable.finalY;
          //   actvsPerTypePrintData.forEach((elem, index) => {
          //     currentPositionHeight = pdf.previousAutoTable.finalY;
          //     let yearY = index > 0 ? pdf?.previousAutoTable.finalY + 5 : 25;

          //     if (currentPositionHeight > 245) {
          //       pdf.addPage();
          //       pdf.previousAutoTable.finalY = 20;
          //       currentPositionHeight = 20;
          //     }

          //     // Insert table header
          //     autoTable(pdf, {
          //       head: [
          //         [
          //           `${elem._id.slice(0, 5)} ${elem.uSystemName || ""}`,
          //           "",
          //           "",
          //           "",
          //           "",

          //           {
          //             content: `${formatCost(elem.totalCost)}`,
          //             styles: { halign: "right" },
          //           },
          //         ],
          //       ],
          //       theme: "plain",
          //       startY: index > 0 ? pdf.previousAutoTable.finalY + 5 : yearY,
          //       styles: {
          //         fillColor: "#C0C0C0",
          //         textColor: "black",
          //         fontSize: 11.5,
          //         fontWeight: "normal",
          //         font: "NunitoSans",
          //       },
          //       margin: { left: 9 }, // Align table to the left where the header line starts
          //       tableWidth: pdf.internal.pageSize.width - 18, // Adjust table width to match the header line width
          //     });

          //     currentPositionHeight = pdf.previousAutoTable.finalY;

          //     let array = elem?.documents;
          //     let array1 = [];
          //     let array2 = [];
          //     let space = 0;
          //     let seventhCount = 0;
          //     let eightCount = 0;
          //     let ninethCount = 0;
          //     let tenthCount = 0;

          //     if (array.length > 0) {
          //       elem?.documents?.map((el) => {
          //         if (el?.maintenance_activity?.length < 10) {
          //           space = space + 7;
          //           seventhCount = seventhCount + 1;
          //         }
          //         if (el?.maintenance_activity?.length > 20) {
          //           space = space + 10;
          //           tenthCount = tenthCount + 1;
          //         } else if (
          //           el?.maintenance_activity?.length > 10 &&
          //           el?.maintenance_activity?.length < 20
          //         ) {
          //           space = space + 9;
          //           eightCount = eightCount + 1;
          //         } else {
          //           space = space + 13;
          //           ninethCount = ninethCount + 1;
          //         }
          //       });
          //       // if (space + currentPositionHeight > 250) {
          //       let availableSpace = 245 - currentPositionHeight;
          //       let result = 0;
          //       if (availableSpace > 0) {
          //         if (
          //           ninethCount >= seventhCount &&
          //           ninethCount >= eightCount &&
          //           ninethCount >= tenthCount
          //         ) {
          //           result = 13; // Corresponds to ninethCount
          //         } else if (
          //           seventhCount >= ninethCount &&
          //           seventhCount >= eightCount &&
          //           seventhCount >= tenthCount
          //         ) {
          //           result = 7; // Corresponds to seventhCount
          //         } else if (
          //           eightCount >= ninethCount &&
          //           eightCount >= seventhCount &&
          //           eightCount >= tenthCount
          //         ) {
          //           result = 9; // Corresponds to eightCount
          //         } else {
          //           result = 10; // Corresponds to tenthCount
          //         }
          //         let num = Math.trunc(availableSpace / 9);
          //         array1 = array.slice(0, num);
          //         array2 = array.slice(num);
          //         // debugger;
          //       } else {
          //         array2 = array;
          //         // debugger;
          //       }
          //       // Render table body
          //       if (array1.length > 0) {
          //         autoTable(pdf, {
          //           head: [
          //             columns.map((col) =>
          //               col.dataKey == "total_cost" ? "" : col.header
          //             ),
          //           ],
          //           body: array1.map((row) =>
          //             columns.map((col) =>
          //               col.dataKey == "flags"
          //                 ? ""
          //                 : col.dataKey == "technical_life"
          //                 ? row[col.dataKey]
          //                   ? row[col.dataKey] + " " + t("property_page.year")
          //                   : "-"
          //                 : row[col.dataKey]
          //             )
          //           ),
          //           startY: pdf.previousAutoTable.finalY,
          //           // margin: { top: 20 },
          //           columnStyles: {
          //             0: { cellWidth: 54, valign: "middle" }, // activity
          //             1: { cellWidth: 28, valign: "middle" }, // article
          //             2: { cellWidth: 13, valign: "middle" }, // article
          //             3: { cellWidth: 25, valign: "middle" }, // interval
          //             4: { cellWidth: 18, valign: "middle" }, // quantity
          //             5: { cellWidth: 14, valign: "middle" }, // unit
          //             6: { cellWidth: 20, valign: "middle" }, // unit price
          //             7: {
          //               cellWidth: 20,
          //               halign: "right",
          //               fontStyle: "bold",
          //               valign: "middle",
          //             }, // total cost
          //           },
          //           styles: {
          //             fillColor: "white",
          //             textColor: "black",
          //             fontWeight: "normal",
          //             valign: "middle",
          //             font: "NunitoSans",
          //           },
          //           headStyles: {
          //             fontSize: 8,
          //             fontWeight: "normal",
          //             textColor: "#B3B3B3",
          //             valign: "middle",
          //             font: "NunitoSans",
          //           },
          //           bodyStyles: {
          //             fontSize: 8,
          //             fontWeight: "normal",
          //             valign: "middle",
          //             font: "NunitoSans",
          //           },
          //           didDrawPage: (data) => {
          //             const currentPage = pdf.internal.getNumberOfPages();

          //             if (currentCount !== currentPage) {
          //               header(); // Call header function
          //               footer(); // Call footer function
          //               currentCount = currentPage;
          //             }
          //             // const tableBottomY = pdf.previousAutoTable.finalY;
          //             // if (
          //             //   tableBottomY >= pdf.internal.pageSize.height - 25 &&
          //             //   data?.row?.index === 0
          //             // ) {
          //             //   yearY = 35;
          //             // }
          //           },
          //           didDrawCell: (data) => {
          //             // For the header cell (Cost column)
          //             if (data.section === "head" && data.column.index === 7) {
          //               const costText = switchState
          //                 ? t("common.pages.INC. VAT")
          //                 : t("common.pages.EX. VAT");

          //               // Get current language
          //               const currentLang = i18n.language; // Assuming you're using i18next

          //               // Adjust position based on language
          //               const xAdjustment = currentLang === "sv" ? 6 : 0; // Shift left by 3 units for Swedish
          //               const xAdjustmentVat = currentLang === "sv" ? 0 : 0.5; // Shift left by 3 units for Swedish
          //               const xPosition =
          //                 data.cell.x + data.cell.width - 10 - xAdjustment;
          //               const yPosition = data.cell.y + data.cell.height / 2;

          //               // Draw "Cost" text
          //               pdf.setFontSize(8);
          //               pdf.text(
          //                 t("planning_page.Cost").toUpperCase(),
          //                 xPosition,
          //                 yPosition
          //               );

          //               // Draw VAT text below "Cost"
          //               pdf.setFontSize(5.5); // Smaller font size for VAT text
          //               pdf.text(
          //                 costText,
          //                 xPosition + xAdjustmentVat,
          //                 yPosition + 2
          //               ); // Adjust Y to move VAT text below
          //             }
          //           },
          //           margin: { left: 9, top: 20 }, // Align table to the left where the header line starts
          //           tableWidth: pdf.internal.pageSize.width - 18, // Adjust table width to match the header line width
          //         });
          //       }
          //       array1 = [];
          //       if (array2.length > 0) {
          //         pdf.addPage(); // Add a new page
          //         pdf.previousAutoTable.finalY = 20;
          //         currentPositionHeight = 20;
          //         autoTable(pdf, {
          //           // head: [
          //           //   columns.map((col) =>
          //           //     col.dataKey == "total_cost" ? "" : col.header
          //           //   ),
          //           // ],
          //           body: array2.map((row) =>
          //             columns.map((col) =>
          //               col.dataKey == "flags"
          //                 ? ""
          //                 : col.dataKey == "technical_life"
          //                 ? row[col.dataKey]
          //                   ? row[col.dataKey] + " " + t("property_page.year")
          //                   : "-"
          //                 : row[col.dataKey]
          //             )
          //           ),
          //           startY: 25,

          //           columnStyles: {
          //             0: { cellWidth: 54, valign: "middle" }, // activity
          //             1: { cellWidth: 28, valign: "middle" }, // article
          //             2: { cellWidth: 13, valign: "middle" }, // article
          //             3: { cellWidth: 25, valign: "middle" }, // interval
          //             4: { cellWidth: 18, valign: "middle" }, // quantity
          //             5: { cellWidth: 14, valign: "middle" }, // unit
          //             6: { cellWidth: 20, valign: "middle" }, // unit price
          //             7: {
          //               cellWidth: 20,
          //               halign: "right",
          //               fontStyle: "bold",
          //               valign: "middle",
          //             }, // total cost
          //           },
          //           styles: {
          //             fillColor: "white",
          //             textColor: "black",
          //             valign: "middle",
          //             font: "NunitoSans",
          //           },
          //           margin: { left: 9, top: 20 }, // Align table to the left where the header line starts
          //           tableWidth: pdf.internal.pageSize.width - 18, // Adjust table width to match the header line width
          //           headStyles: {
          //             fontSize: 8,
          //             fillColor: "#C0C0C0",
          //             fontWeight: "normal",
          //             valign: "middle",
          //             font: "NunitoSans",
          //           },
          //           bodyStyles: {
          //             fontSize: 8,
          //             fontWeight: "normal",
          //             valign: "middle",
          //             font: "NunitoSans",
          //           },
          //           didDrawPage: (data) => {
          //             const currentPage = pdf.internal.getNumberOfPages();

          //             if (currentCount !== currentPage) {
          //               header(); // Call header function
          //               footer(); // Call footer function
          //               currentCount = currentPage;
          //             }

          //             // const tableBottomY = pdf.previousAutoTable.finalY;
          //             // if (
          //             //   tableBottomY >= pdf.internal.pageSize.height - 25 &&
          //             //   data?.row?.index === 0
          //             // ) {
          //             //   yearY = 35;
          //             // }
          //           },
          //           didDrawCell: (data) => {
          //             // For the header cell (Cost column)
          //             if (data.section === "head" && data.column.index === 7) {
          //               const costText = switchState
          //                 ? t("common.pages.INC. VAT")
          //                 : t("common.pages.EX. VAT");

          //               // Get current language
          //               const currentLang = i18n.language; // Assuming you're using i18next

          //               // Adjust position based on language
          //               const xAdjustment = currentLang === "sv" ? 6 : 0; // Shift left by 3 units for Swedish
          //               const xAdjustmentVat = currentLang === "sv" ? 0 : 0.5; // Shift left by 3 units for Swedish
          //               const xPosition =
          //                 data.cell.x + data.cell.width - 10 - xAdjustment;
          //               const yPosition = data.cell.y + data.cell.height / 2;

          //               // Draw "Cost" text
          //               pdf.setFontSize(8);
          //               pdf.text(
          //                 t("planning_page.Cost").toUpperCase(),
          //                 xPosition,
          //                 yPosition
          //               );

          //               // Draw VAT text below "Cost"
          //               pdf.setFontSize(5.5); // Smaller font size for VAT text
          //               pdf.text(
          //                 costText,
          //                 xPosition + xAdjustmentVat,
          //                 yPosition + 2
          //               ); // Adjust Y to move VAT text below
          //             }
          //           },
          //         });
          //         array2 = [];
          //       }
          //     }
          //   });
          // };

          function getFlagsIcons(item) {
            let flags = "";
            if (item.energy_flag) flags += "🌿"; // Energy Flag Icon
            if (item.invest_flag) flags += "💰"; // Invest Flag Icon
            if (item.risk_flag) flags += "⚠️"; // Risk Flag Icon
            if (item.project_flag) flags += "📋"; // Project Flag Icon
            if (item.inspection_flag) flags += "🔍"; // Inspection Flag Icon
            return flags;
          }

          function getStatusLabel(item, t) {
            switch (item.status) {
              case "Planerad":
                return t("plan_color");
              case "Akut":
                return t("akut_color");
              case "Eftersatt":
                return t("efter_color");
              case "Beslutad":
                return t("beslu_color");
              case "Utförd":
                return t("utford_color");
              default:
                return t("common.pages.choose");
            }
          }

          // if (selectedPoints.includes("coverPage")) {
          //   addFirstPageContent();
          // }
          const getImageAsBase64 = async (imageUrl) => {
            try {
              const response = await api.get(
                `/images/proxy-image?url=${encodeURIComponent(imageUrl)}`,
                {
                  responseType: "arraybuffer",
                }
              );
              const blob = new Blob([response.data], { type: "image/png" });

              // Create a promise that resolves with both base64 and dimensions
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  // Create an image element to get dimensions
                  const img = new Image();
                  img.onload = () => {
                    resolve({
                      base64: reader.result,
                      width: img.width,
                      height: img.height,
                      aspectRatio: img.width / img.height,
                    });
                  };
                  img.src = reader.result;
                };
                reader.readAsDataURL(blob);
              });
            } catch (error) {
              console.error(error);
              throw error;
            }
          };
          if (target == "table") {
            addFifthPageContent();
            if (signal.aborted) throw new Error("PDF generation cancelled");
            pdf.addPage();
            renderSixthPagePDF();
            if (!signal.aborted) {
              await removeFirstPageIfNeeded(pdf);
              pdf.save("download.pdf");
            }
            setPrintLoader(false);
            resolve();
            return;
          } else {
            // if (
            //   selectedPoints.includes("tableOfContent") &&
            //   !tableOfContentAdded
            // ) {
            //   if (signal.aborted) throw new Error("PDF generation cancelled");
            //   tableOfContentAdded = true;
            //   pdf.addPage();
            //   addSecondPageContent();
            // }

            if (selectedPoints.includes("coverPage")) {
              if (pdf.getNumberOfPages() === 0) {
                pdf.addPage(); // If no pages exist, add a new page
              }
              pdf.setPage(1);
              // Add image
              // header();
              // footer();
              const defaultImage =
                "https://janus-uploads.s3.eu-north-1.amazonaws.com/1736341049810-construction.png";
              const imageUrl = maintenanceReport?.image || defaultImage;

              const imageData = await getImageAsBase64(imageUrl);
              // console.log("imageData image", imageData);
              // Calculate dimensions to fit properly on PDF page
              const pageWidth = pdf.internal.pageSize.width;
              const maxWidth = 100; // Maximum width in mm
              const maxHeight = 100; // Maximum height in mm

              let finalWidth, finalHeight;

              if (imageData.aspectRatio > 1) {
                // Image is wider than tall
                finalWidth = Math.min(maxWidth, pageWidth - 40); // 20mm margin on each side
                finalHeight = finalWidth / imageData.aspectRatio;

                // Check if height exceeds max height
                if (finalHeight > maxHeight) {
                  finalHeight = maxHeight;
                  finalWidth = finalHeight * imageData.aspectRatio;
                }
              } else {
                // Image is taller than wide
                finalHeight = Math.min(maxHeight, 200); // Limit height
                finalWidth = finalHeight * imageData.aspectRatio;

                // Check if width exceeds max width
                if (finalWidth > maxWidth) {
                  finalWidth = maxWidth;
                  finalHeight = finalWidth / imageData.aspectRatio;
                }
              }

              // Calculate center position
              const xPos = (pageWidth - finalWidth) / 2;
              const marginY = 60; // Top margin

              // Add image to PDF
              pdf.addImage(
                imageData.base64,
                "PNG",
                xPos,
                marginY,
                finalWidth,
                finalHeight
              );

              // Adjust text position based on actual image height
              const titleY = marginY + finalHeight + 20;
              pdf.setFontSize(24);
              pdf.setFont("NunitoSans", "bold");
              pdf.text(
                "Underhållsplan",
                pdf.internal.pageSize.width / 2,
                titleY,
                { align: "center" }
              );

              // Adjust year text position
              pdf.setFontSize(18);
              const startYear = maintenanceSettings?.plan_start_year;
              const endYear =
                parseInt(maintenanceSettings.plan_start_year) +
                parseInt(maintenanceSettings.plan_duration);
              console.log("start year", startYear);
              pdf.text(
                `${startYear} - ${endYear}`,
                pdf.internal.pageSize.width / 2,
                titleY + 20,
                { align: "center" }
              );

              // Add this check for cover page only
              if (
                selectedPoints.length === 1 &&
                selectedPoints.includes("coverPage")
              ) {
                if (signal.aborted) throw new Error("PDF generation cancelled");
                if (!signal.aborted) {
                  pdf.save("download.pdf");
                }
                setPrintLoader(false);
                resolve();
                return;
              }

              // Then continue with existing conditions
              // if (
              //   !selectedPoints.includes("maintenanceDiagram") &&
              //   !selectedPoints.includes("depositionsDiagram")
              // ) {
              //   if (
              //     selectedPoints.includes("tableOfContent") &&
              //     !tableOfContentAdded
              //   ) {
              //     if (signal.aborted)
              //       throw new Error("PDF generation cancelled");
              //     tableOfContentAdded = true;
              //     pdf.addPage();
              //     addSecondPageContent();
              //   }
              //   if (!signal.aborted) {
              //     await removeFirstPageIfNeeded(pdf);
              //     pdf.save("download.pdf");
              //   }
              //   setPrintLoader(false);
              //   resolve();
              //   return;
              // }
            }
            if (selectedPoints.includes("planSettings")) {
              if (signal.aborted) throw new Error("PDF generation cancelled");
              pdf.addPage();
              addThirdPageContent();
            }

            if (selectedPoints.includes("myCustomText")) {
              if (signal.aborted) throw new Error("PDF generation cancelled");

              const content = htmlContentRef.current.innerHTML;

              try {
                // Scale down the font sizes in the content
                const scaledContent = content.replace(
                  /font-size:\s*(\d+)px/g,
                  (match, size) =>
                    `font-size: ${Math.floor(parseInt(size) * 0.25)}px`
                );

                // Create temporary div to handle HTML content
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = scaledContent;

                // Process each HTML element
                const processNode = (node) => {
                  if (node.nodeType === Node.TEXT_NODE) {
                    return node.textContent;
                  }

                  let text = "";
                  console.log("node.nodeName", node.nodeName, node);
                  switch (node.nodeName.toLowerCase()) {
                    case "h1":
                      pdf.setFontSize(18);
                      pdf.setFont("NunitoSans", "bold");
                      pdf.setTextColor(0, 0, 0);
                      break;
                    case "h2":
                      pdf.setFontSize(16);
                      pdf.setFont("NunitoSans", "bold");
                      pdf.setTextColor(0, 0, 0);
                      break;
                    case "h3":
                      pdf.setFontSize(11);
                      pdf.setFont("NunitoSans", "bold");
                      pdf.setTextColor(0, 0, 0);
                      break;
                    case "p":
                      pdf.setFontSize(11);
                      pdf.setFont("NunitoSans", "normal");
                      pdf.setTextColor(0, 0, 0);
                      break;
                    case "strong":
                      pdf.setFontSize(11);
                      pdf.setFont("NunitoSans", "bold");
                      pdf.setTextColor(0, 0, 0);
                      break;
                    case "br":
                      return "\n\n"; // Double line break for <br /> tags
                    case "ol":
                      pdf.setFontSize(12);
                      let counter = 1;
                      node.childNodes.forEach((li, index) => {
                        if (li.nodeName.toLowerCase() === "li") {
                          const isLastLi = li === node.lastElementChild;
                          text += `${counter}. ${li.textContent}`;
                          if (!isLastLi) {
                            text += "\n";
                          }
                          counter++;
                        }
                      });
                      pdf.setFont("NunitoSans", "normal");
                      pdf.setTextColor(0, 0, 0);
                      return text;
                    case "ul":
                      pdf.setFontSize(12);
                      node.childNodes.forEach((li, index) => {
                        if (li.nodeName.toLowerCase() === "li") {
                          const isLastLi = li === node.lastElementChild; // Check if it's the last <li>
                          text += `• ${li.textContent}`;
                          if (!isLastLi) {
                            text += "\n"; // Add a newline only if it's not the last <li>
                          }
                        }
                      });
                      pdf.setFont("NunitoSans", "normal");
                      pdf.setTextColor(0, 0, 0);
                      return text;
                    default:
                      break;
                  }

                  // Process child nodes
                  node.childNodes.forEach((child) => {
                    text += processNode(child);
                  });

                  // Only add a single newline after elements unless it's a <br />
                  return text;
                };

                // Add content page by page
                pdf.addPage();
                header();

                const pageWidth = pdf.internal.pageSize.getWidth();
                const margin = 10;
                const contentWidth = pageWidth - 2 * margin;
                let y = 30;
                pdf.setTextColor(0, 0, 0);
                // Process content with formatting
                const elements = Array.from(tempDiv.children);
                for (let element of elements) {
                  let text = processNode(element);
                  // Store current font settings before checking page break
                  const currentFontSize = pdf.getFontSize();
                  const currentFontStyle = pdf.getFont().fontStyle;
                  let extraSpacing = 0;
                  if (element.nodeName.toLowerCase() === "br") {
                    text = " ";
                  }
                  // Check if we need a new page
                  if (y > pdf.internal.pageSize.getHeight() - 60) {
                    footer();
                    pdf.addPage();
                    header();
                    y = 30;
                    pdf.setTextColor(0, 0, 0);
                    // Restore the font settings that were active
                    pdf.setFontSize(currentFontSize);
                    pdf.setFont("NunitoSans", currentFontStyle);
                  }
                  // Add text with proper formatting
                  pdf.text(text, margin, y, {
                    maxWidth: contentWidth,
                    align: "left",
                  });
                  y +=
                    pdf.getTextDimensions(text, {
                      maxWidth: contentWidth,
                    }).h +
                    2 +
                    extraSpacing;
                }

                footer();
              } catch (err) {
                console.error("PDF page generation failed:", err);
                throw err;
              }
            }

            if (selectedPoints.includes("propertyAndBuildingData")) {
              if (signal.aborted) throw new Error("PDF generation cancelled");
              pdf.addPage();
              addFourthPageContent();
            }
            if (
              selectedPoints.includes("maintenanceActivitiesPerYear") &&
              printData &&
              printData?.length > 0
            ) {
              if (signal.aborted) throw new Error("PDF generation cancelled");
              pdf.addPage();
              addFifthPageContent();
            }
            if (
              selectedPoints.includes("maintenanceActivitiesPerSystem") &&
              planningGroupsByType &&
              planningGroupsByType?.length > 0
            ) {
              if (signal.aborted) throw new Error("PDF generation cancelled");
              pdf.addPage();
              renderSixthPagePDF();
            }

            if (
              selectedPoints.includes("maintenanceDiagram") ||
              selectedPoints.includes("depositionsDiagram")
            ) {
              let text;
              let chartElement = chartRef.current;

              if (selectedPoints.includes("maintenanceDiagram")) {
                if (signal.aborted) throw new Error("PDF generation cancelled");
                pdf.addPage();
                header();
                let currentPage = pdf.internal.getNumberOfPages();
                maintainenace_diagram_page_num = currentPage + 1;
                chartElement.style.visibility = "visible";
                chartElement.style.position = "absolute"; // Keep it out of flow
                chartElement.style.zIndex = "-1"; // Send it to the back

                let canvas = await html2canvas(chartElement);
                let maintainenceImageData = canvas.toDataURL("image/png");
                let imgWidth = 190; // PDF page width minus margins
                let imgHeight = (canvas.height * imgWidth) / canvas.width;
                // pdf.setFontSize(16);
                // text = t("property_page.Maintenance_diagram");
                // pdf.text(text, 105, 34, { align: "center" });
                // Title - Left aligned
                pdf.setFontSize(18);
                pdf.setFont("NunitoSans", "normal");
                pdf.setTextColor(64, 64, 64);
                pdf.text(t("property_page.Maintenance_diagram"), 10, 40); // Align to left with x=7
                pdf.addImage(
                  maintainenceImageData,
                  "PNG",
                  10,
                  50,
                  imgWidth,
                  imgHeight
                );
                footer();

                if (!selectedPoints.includes("depositionsDiagram")) {
                  // if (
                  //   selectedPoints.includes("tableOfContent") &&
                  //   !tableOfContentAdded
                  // ) {
                  //   if (signal.aborted)
                  //     throw new Error("PDF generation cancelled");
                  //   tableOfContentAdded = true;
                  //   pdf.addPage();
                  //   addSecondPageContent();
                  // }
                  chartElement.style.visibility = "hidden";
                  // if (!signal.aborted) {
                  //   await removeFirstPageIfNeeded(pdf);
                  //   pdf.save("download.pdf");
                  // }
                  // setPrintLoader(false);
                }
              }

              if (selectedPoints.includes("depositionsDiagram")) {
                if (signal.aborted) throw new Error("PDF generation cancelled");
                pdf.addPage();
                header();
                let currentPage = pdf.internal.getNumberOfPages();
                deposition_diagram_page_num = currentPage + 1;
                let lineChartElement = lineChartRef.current;
                lineChartElement.style.visibility = "visible";
                lineChartElement.style.position = "absolute"; // Keep it out of flow
                lineChartElement.style.zIndex = "-1";

                let canvas2 = await html2canvas(lineChartElement);
                const imgData2 = canvas2.toDataURL("image/png");

                const imgWidth2 = 190; // PDF page width minus margins
                const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width; // Maintain aspect ratio

                // pdf.setFontSize(16);
                text = t("property_page.Depositions_diagram");
                // pdf.text(text, 105, 34, { align: "center" });
                pdf.setFontSize(18);
                pdf.setFont("NunitoSans", "normal");
                pdf.setTextColor(64, 64, 64);
                pdf.text(text, 10, 40); // Align to left with x=7
                pdf.addImage(imgData2, "PNG", 10, 50, imgWidth2, imgHeight2);
                if (
                  selectedPoints.includes("tableOfContent") &&
                  !tableOfContentAdded
                )
                  // {
                  //   if (signal.aborted)
                  //     throw new Error("PDF generation cancelled");
                  //   tableOfContentAdded = true;
                  //   pdf.addPage();
                  //   addSecondPageContent();
                  // } else {
                  footer();
                // }
                // if (!selectedPoints.includes("myCustomText")) {
                // if (signal.aborted) throw new Error("PDF generation cancelled");
                // if (!signal.aborted) {
                //   await removeFirstPageIfNeeded(pdf);
                //   pdf.save("download.pdf");
                //   // Save PDF here after chart is added
                // }
                // setPrintLoader(false);
                lineChartElement.style.visibility = "hidden";
                chartElement.style.visibility = "hidden";
                // }
              }
            }

            if (
              selectedPoints.includes("tableOfContent") &&
              !tableOfContentAdded
            ) {
              if (signal.aborted) throw new Error("PDF generation cancelled");
              tableOfContentAdded = true;
              pdf.insertPage(2); // Instead of `addPage()`, insert it at page 2
              pdf.setPage(2);
              addSecondPageContent();
            }
            if (signal.aborted) throw new Error("PDF generation cancelled");
            if (!signal.aborted) {
              await removeFirstPageIfNeeded(pdf);
              pdf.save("download.pdf");
            }
            setPrintLoader(false);
            resolve();
            // pdf.setPage(1);
            setPrintLoader(false);
            return;
          }
        } catch (error) {
          setPrintLoader(false);
          console.error(error);
          reject(error);
        }
      });

      // Wait for PDF generation to complete or be aborted
      await pdfPromise;
      setPrintLoader(false);
    } catch (error) {
      setPrintLoader(false);
      console.error(error);
    }
  };

  const handlePrintClick = () => {
    setPrintLoader(true);
    setMenuCol(false);
    // setTimeout(() => {
    genratePdf("report");
    handleChangeAction(null);
    // }, [100]);
  };

  const handleJustPrintClick = () => {
    if (printData?.length > 0) {
      setMenuCol(false);
      setTimeout(() => {
        genratePdf("table");
        handleChangeAction(null);
      }, [100]);
    } else {
      toast.error("Please wait data is loading...");
      setMenuCol(false);
      handleChangeAction(null);
    }
  };

  const handleOpenPrintModal = () => {
    setPrintModal(true);
  };

  const handleClosePrintModal = () => {
    // Abort any in-progress PDF generation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setPrintLoader(false);
    setLoading(false);
    setSelectedPoints([]);
    handleChangeAction(null);
    setPrintModal(false);
  };

  useEffect(() => {
    let u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    getAllMaintenancePlan();
  }, [showDrawer, currentTab]);

  useEffect(() => {
    let u = JSON.parse(localStorage.getItem("user"));
    // if (u) getMaintencanceSettings(u?._id);
    getAllMaintenanceDiagramData(setMaintananceDiagramData);
    getMaintenanceDepositionData(setDepositionData);
    getMaintenanceReport(setMaintenanceReport);
    getMaintenanceSettings(setMaintenanceSettings);
    getUsystems(setUsystems);
  }, []);

  useEffect(() => {
    //debugger;
    if (printItem && currReprtTab === "activitesyear") {
      // if (loading) {
      //   toast.error("Please wait content is loading!");
      // } else {
      handleChangePoint("maintenanceActivitiesPerYear");
      handleJustPrintClick();

      // }
    }
  }, [printItem]);

  useEffect(() => {
    if (createReport && currReprtTab === "activitesyear") {
      handleOpenPrintModal();
    }
  }, [createReport]);

  // useEffect(() => {
  //   uniquePropertyAndBuildings(
  //     maintainancePlan,
  //     value,
  //     setUniquePropsAndBuilds
  //   );
  // }, [value, maintainancePlan]);

  const handleChangeStatus = async (StatusName, documentId) => {
    try {
      let res = await api.patch(
        `/planning_component/maintainance/activites-year-status/${documentId}`,
        { StatusName }
      );
      handleFindClick();
    } catch (error) {
      console.error(error);
    }
  };

  const getMaintencanceSettings = async (id) => {
    const res = await api.get(`/maintenance_settings/${id}`);
    setFormData(res?.data);
  };

  // const genratePdf = useReactToPrint({
  //   content: () => printRef.current,
  //   documentTitle: "Activities Per Year",
  //   onAfterPrint: () => {
  //     setMenuCol(true);
  //   },
  // });

  const getStatusColor = (status) => {
    status = status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();

    const statusMap = {
      Planerad: "plan_color",
      Akut: "akut_color",
      Eftersatt: "efter_color",
      Beslutad: "beslu_color",
      Utförd: "utford_color",
    };

    const statusClass = statusMap[status];

    return statusClass ? (
      <div className={`plan_color_div dropdown_icon ${statusClass}`}></div>
    ) : null;
  };

  const handleChangePoint = (point) => {
    if (selectedPoints?.includes(point)) {
      setSelectedPoints(selectedPoints?.filter((el) => el !== point));
    } else {
      setSelectedPoints([...selectedPoints, point]);
    }
  };

  // const sortContent = () => {
  //   // Create a lookup map for the order values
  //   const orderMap = {};
  //   contentOrder.forEach((item) => {
  //     const key = Object.keys(item)[0];
  //     orderMap[key] = item[key];
  //   });
  //   // Sort the array based on the lookup map
  //   // selectedPoints.sort((a, b) => orderMap[a] - orderMap[b]);
  //   // console.log("breakIndexs", breakIndexs);
  //   // console.log("actvsPerTypeBreakIndexs", actvsPerTypeBreakIndexs);

  //   const defaultOrderValue = 100;

  //   // Sort the array based on the lookup map
  //   selectedPoints.sort((a, b) => {
  //     const orderA =
  //       orderMap[a] !== undefined ? orderMap[a] : defaultOrderValue;
  //     const orderB =
  //       orderMap[b] !== undefined ? orderMap[b] : defaultOrderValue;
  //     return orderA - orderB;
  //   });

  //   console.log(selectedPoints);

  //   let lastNo = 0;
  //   let pageNumbers = {};
  //   selectedPoints?.map((el) => {
  //     if (el === "coverPage") {
  //       lastNo += 1;
  //     }
  //     if (el === "tableOfContent") {
  //       lastNo += 1;
  //     }
  //     if (el === "planSettings") {
  //       lastNo += 1;
  //       pageNumbers.planSettings = lastNo;
  //     }
  //     if (el === "myCustomText") {
  //       lastNo += 1;
  //       pageNumbers.myCustomText = lastNo;
  //     }
  //     if (el === "propertyAndBuildingData") {
  //       pageNumbers.propertyAndBuildingData = lastNo + 1;
  //       lastNo += Math.round(uniquePropsAndBuilds?.length / 2);
  //     }
  //     if (el === "maintenanceDiagram") {
  //       lastNo += 1;
  //       pageNumbers.maintenanceDiagram = lastNo;
  //     }
  //     if (el === "maintenanceActivitiesPerYear") {
  //       pageNumbers.maintenanceActivitiesPerYear = lastNo + 1;
  //       lastNo += breakIndexs == 0 ? 1 : breakIndexs?.length + 2;
  //     }
  //     if (el === "maintenanceActivitiesPerSystem") {
  //       pageNumbers.maintenanceActivitiesPerSystem = lastNo + 1;
  //       lastNo +=
  //         actvsPerTypeBreakIndexs == 0
  //           ? 1
  //           : actvsPerTypeBreakIndexs?.length + 2;
  //     }
  //     if (el === "depositionsDiagram") {
  //       pageNumbers.depositionsDiagram = lastNo + 1;
  //       // lastNo +=
  //       //   actvsPerTypeBreakIndexs == 0
  //       //     ? 1
  //       //     : actvsPerTypeBreakIndexs?.length + 2;
  //     }
  //   });
  //   setPageNumbering(pageNumbers);
  // };

  const addVAT = (data, percent) => {
    let updatedPlan = data?.map((elem) => {
      return {
        ...elem,
        totalCost: (elem?.totalCost * percent) / 100 + elem?.totalCost,
        documents: elem.documents.map((item) => {
          if (item?.total_cost) {
            return {
              ...item,
              total_cost:
                (parseInt(item?.total_cost) * percent) / 100 +
                parseInt(item?.total_cost),
            };
          } else {
            return item;
          }
        }),
      };
    });
    return updatedPlan;
  };

  useEffect(() => {
    sortContent(
      selectedPoints,
      uniquePropsAndBuilds,
      breakIndexs,
      actvsPerTypeBreakIndexs,
      setPageNumbering
    );
  }, [selectedPoints]);

  const handleChangeSwitch = (e) => {
    setSwitchState(e);
    //debugger;
    if (e === true && formData?.vat_percent) {
      let percent = formData.vat_percent;
      let updatedPlan = addVAT(maintainancePlan, percent);
      let updatedPrintData = addVAT(printData, percent);
      setMaintainancePlan(updatedPlan);
      setPrintData(updatedPrintData);
      setActvsPerYearPrintData(updatedPrintData);
    } else {
      setMaintainancePlan(dupMaintainancePlan);
      setPrintData(dupPrintData);
      setActvsPerYearPrintData(dupPrintData);
    }
  };

  return (
    <>
      {/* Filter Code */}
      <Filter
        handleFindClick={handleFindClick}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        status={true}
      />

      <div className="side_paneL_root_main">
        {showSidePanel && <SidePanelRoot />}
      </div>
      {loading ? (
        <div style={{ marginBottom: "1rem" }}>
          <Loader />
        </div>
      ) : (
        <div
          // ref={printRef}
          // style={{ width: "100%" }}
          className="table_scroll"
        >
          <Table>
            <thead>
              <tr className="activites_header">
                <th>{t("planning_page.activity")}</th>
                <th>{t("planning_page.article")}</th>
                <th>SYSTEM</th>
                <th>{t("planning_page.interval")}</th>
                <th>{t("planning_page.flags")}</th>
                <th>STATUS</th>
                <th>
                  <div className="vat_switch">
                    <Switch
                      checked={switchState}
                      setChecked={setSwitchState}
                      disabled={!formData?.vat_percent}
                      onChange={handleChangeSwitch}
                      text={
                        !switchState
                          ? t("common.pages.EX. VAT")
                          : t("common.pages.INC. VAT")
                      }
                    />
                  </div>
                  <div>{t("planning_page.total_cost")}</div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="activites_year_table_main">
              {maintainancePlan?.map((elem) => (
                <>
                  <tr className="activites_start_year activites_year_cost_main">
                    <td>{elem._id}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{formatCost(elem.totalCost)}</td>
                    <td></td>
                  </tr>
                  {elem?.documents?.map((item) => (
                    <>
                      <tr className={"activites_start_year activites_activity"}>
                        <td className="reportYearTD activiCol">
                          <div style={{ textWrap: "wrap" }}>
                            {item?.maintenance_activity?.length <= 73
                              ? item?.maintenance_activity
                              : `${item?.maintenance_activity?.substring(
                                  0,
                                  73
                                )}...`}
                            {/* {item.maintenance_activity} */}
                          </div>
                        </td>
                        <td className={"reportYearTD"}>{item?.article}</td>
                        <td className={"reportYearTD"}>{item?.u_system}</td>
                        <td className={"reportYearTD"}>
                          {item.technical_life
                            ? item.technical_life +
                              " " +
                              t("planning_page.years")
                            : "-"}
                        </td>
                        <td className={"reportYearTD"}>
                          {item.energy_flag && (
                            <img
                              src={leaf_icon}
                              alt="leaf-icon"
                              className={"leaf_img"}
                            />
                          )}
                          {item.invest_flag && (
                            <img
                              src={money_icon}
                              alt="money-icon"
                              className={"leaf_img"}
                            />
                          )}
                          {item.risk_flag && (
                            <img
                              src={risk_icon}
                              alt="risk-icon"
                              className={"leaf_img"}
                            />
                          )}
                          {item.project_flag && (
                            <img
                              src={project_icon}
                              alt="project-icon"
                              className={"leaf_img"}
                            />
                          )}

                          {item.inspection_flag && (
                            <img
                              src={search_icon}
                              alt="search-icon"
                              className={"leaf_img"}
                            />
                          )}
                        </td>
                        <td className={"reportYearTD"}>
                          <Dropdown className={"dropdown_year"}>
                            <Dropdown.Toggle className="activites_year_dropdown activtesYear_dropdown_btn activites_dropdown">
                              <div className="status_color_main">
                                {getStatusColor(item?.status)}
                                {!item.status || item.status === "Choose"
                                  ? t("common.pages.choose")
                                  : t(`common.pages.${item?.status}`)}
                              </div>
                              <FaCaretDown />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() =>
                                  handleChangeStatus("Planerad", item._id)
                                }
                                className="activitesYear_dropdown_menu_item plan_main"
                              >
                                <div className="plan_color_div dropdown_icon plan_color"></div>

                                {t(`common.pages.Planerad`)}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  handleChangeStatus("Akut", item._id)
                                }
                                className="activitesYear_dropdown_menu_item plan_main"
                              >
                                <div className="plan_color_div dropdown_icon akut_color"></div>
                                {t(`common.pages.Akut`)}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  handleChangeStatus("Eftersatt", item._id)
                                }
                                className="activitesYear_dropdown_menu_item plan_main"
                              >
                                <div className="plan_color_div dropdown_icon efter_color"></div>
                                {t(`common.pages.Eftersatt`)}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  handleChangeStatus("Beslutad", item._id)
                                }
                                className="activitesYear_dropdown_menu_item plan_main"
                              >
                                <div className="plan_color_div dropdown_icon beslu_color"></div>
                                {t(`common.pages.Beslutad`)}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  handleChangeStatus("Utförd", item._id)
                                }
                                className="activitesYear_dropdown_menu_item plan_main"
                              >
                                <div className="plan_color_div dropdown_icon utford_color"></div>
                                {t(`common.pages.Utförd`)}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                        <td className={"reportYearTD"}>
                          {/* {`${item.total_cost}`?.length <= 4
                            ? item.total_cost
                            : item.total_cost
                                ?.toLocaleString()
                                ?.replace(/,/g, " ")} */}
                          {formatCost(item.total_cost)}
                        </td>
                        <td>
                          <Dropdown className="dropdown_year" drop={"left"}>
                            <Dropdown.Toggle className="activites_year_dropdown">
                              <BsThreeDots />
                            </Dropdown.Toggle>
                            <div className="dropdown_menu_main">
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => detailModalShow(item)}
                                  className="Year_edit_menu_item"
                                >
                                  {t("planning_page.details")}
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => {
                                    setShowSidePanel(true);
                                    filesModal(item);
                                  }}
                                  className="Year_edit_menu_item"
                                >
                                  {t("planning_page.files")}
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => {
                                    setShowSidePanel(true);
                                    handleNewProperty(item, true);
                                  }}
                                  className="Year_edit_menu_item"
                                >
                                  {t("planning_page.copy")}
                                </Dropdown.Item>
                                <Dropdown.Item
                                  className="Year_edit_menu_item"
                                  onClick={() => {
                                    setShowSidePanel(true);
                                    handleNewProperty(item, false);
                                  }}
                                >
                                  {t("planning_page.edit")}
                                </Dropdown.Item>
                                <Dropdown.Item
                                  className="Year_edit_menu_item"
                                  onClick={() => handleShow(item)}
                                >
                                  {t("planning_page.delete")}
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </div>
                          </Dropdown>
                        </td>
                      </tr>
                    </>
                  ))}
                </>
              ))}
            </tbody>
          </Table>
          <div
            ref={htmlContentRef}
            style={{ visibility: "hidden", position: "absolute", zIndex: "-1" }}
            dangerouslySetInnerHTML={{ __html: maintenanceReport?.value }}
          />
          <div
            className="maintancne_diagram"
            ref={chartRef}
            style={{ visibility: "hidden", position: "absolute", zIndex: "-1" }}
            // style={{ display: "none" }}
          >
            <Bar data={maintananceDiagramData} options={options} />
          </div>
          <div>
            <div
              className="maintancne_diagram"
              ref={lineChartRef}
              style={{
                visibility: "hidden",
                position: "absolute",
                zIndex: "-1",
              }}
            >
              <Line data={depData} options={depOptions} />
            </div>
          </div>
        </div>
      )}

      {/* ... Tables For Print ... */}
      {/* <div
        ref={printRef}
        // className={menuCol ? "displayNone" : ""}
        style={{ margin: "0px 45px 0px 45px" }}
      >
        <PrintData
          selectedPoints={selectedPoints}
          maintenanceReport={maintenanceReport}
          pageNumbering={pageNumbering}
          filterValues={filterValues}
          maintenanceSettings={maintenanceSettings}
          uniquePropsAndBuilds={uniquePropsAndBuilds}
          maintananceDiagramData={maintananceDiagramData}
          options={options}
          user={user}
          printData={printData}
          breakIndexs={breakIndexs}
          actvsPerTypeBreakIndexs={actvsPerTypeBreakIndexs}
          actvsPerTypePrintData={actvsPerTypePrintData}
          depositionData={depositionData}
          depOptions={depOptions}
          Usystems={Usystems}
          allProperties={value}
          switchState={switchState}
        />
      </div> */}
      {/* Delete Modal */}
      {show && (
        <DeleteModal
          deleteModalClose={deleteModalClose}
          show={show}
          initalVal={initalVal}
          setMaintainancePlan={setMaintainancePlan}
          maintainancePlan={maintainancePlan}
        />
      )}
      {/* Detail Modal */}
      {detailModal && (
        <DetailModal
          detailModalClose={detailModalClose}
          detailModal={detailModal}
          initalVal={initalVal}
        />
      )}
      {/* Print Modal */}
      <PrintModal
        loader={printLoader}
        show={printModal}
        setPrintModal={setPrintModal}
        handleChangeAction={handleChangeAction}
        handleChangePoint={handleChangePoint}
        handlePrintClick={handlePrintClick}
        setSelectedPoints={setSelectedPoints}
        handleClosePrintModal={handleClosePrintModal}
      />
    </>
  );
};

export default Activitesyear;
