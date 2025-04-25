/* eslint-disable */
import api from "api";
import { t } from "i18next";

export const contentOrder = [
  { coverPage: 1 },
  { tableOfContent: 2 },
  { planSettings: 3 },
  { myCustomText: 4 },
  { propertyAndBuildingData: 5 },
  { maintenanceActivitiesPerYear: 6 },
  { maintenanceActivitiesPerSystem: 7 },
  { maintenanceDiagram: 8 },
  { depositionsDiagram: 9 },
];

export const contentTexts = [
  "planSettings",
  "myCustomText",
  "propertyAndBuildingData",
  "maintenanceActivitiesPerYear",
  "maintenanceActivitiesPerSystem",
  "maintenanceDiagram",
  "depositionsDiagram",
];

export const contentTextsVariables = {
  planSettings: "Settings",
  myCustomText: "My custom text",
  propertyAndBuildingData: "Property_and_building_data",
  maintenanceActivitiesPerYear: "Maintenance_activities_per_year",
  maintenanceActivitiesPerSystem: "Maintenance_activities_per_system",
  maintenanceDiagram: "Maintenance_diagram",
  depositionsDiagram: "Depositions_diagram",
};
const plugins = {
  legend: {
    position: "bottom",
    // labels: {
    //   padding: 10, // Add padding between legend items
    // },
  },
};
export const options = {
  responsive: true,
  plugins,
  scales: {
    x: {
      beginAtZero: true,
      stacked: true,
      grid: {
        display: false, // Remove vertical grid lines
      },
    },
    y: {
      beginAtZero: true,
      stacked: true,
    },
  },
};

export const depOptions = {
  responsive: true,
  plugins,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const sortContent = (
  selectedPoints,
  uniquePropsAndBuilds,
  breakIndexs,
  actvsPerTypeBreakIndexs,
  setPageNumbering
) => {
  // Create a lookup map for the order values
  const orderMap = {};
  contentOrder.forEach((item) => {
    const key = Object.keys(item)[0];
    orderMap[key] = item[key];
  });
  // Sort the array based on the lookup map
  // selectedPoints.sort((a, b) => orderMap[a] - orderMap[b]);
  // console.log("breakIndexs", breakIndexs);
  // console.log("actvsPerTypeBreakIndexs", actvsPerTypeBreakIndexs);

  const defaultOrderValue = 100;

  // Sort the array based on the lookup map
  selectedPoints?.sort((a, b) => {
    const orderA = orderMap[a] !== undefined ? orderMap[a] : defaultOrderValue;
    const orderB = orderMap[b] !== undefined ? orderMap[b] : defaultOrderValue;
    return orderA - orderB;
  });

  console.log(selectedPoints);

  let lastNo = 0;
  let pageNumbers = {};
  selectedPoints?.map((el) => {
    if (el === "coverPage") {
      lastNo += 1;
    }
    if (el === "tableOfContent") {
      lastNo += 1;
    }
    if (el === "planSettings") {
      lastNo += 1;
      pageNumbers.planSettings = lastNo;
    }
    if (el === "myCustomText") {
      lastNo += 1;
      pageNumbers.myCustomText = lastNo;
    }
    if (el === "propertyAndBuildingData") {
      pageNumbers.propertyAndBuildingData = lastNo + 1;
      lastNo += Math.round(uniquePropsAndBuilds?.length / 2);
    }
    if (el === "maintenanceDiagram") {
      lastNo += 1;
      pageNumbers.maintenanceDiagram = lastNo;
    }
    if (el === "maintenanceActivitiesPerYear") {
      pageNumbers.maintenanceActivitiesPerYear = lastNo + 1;
      lastNo += breakIndexs == 0 ? 1 : breakIndexs?.length + 2;
    }
    if (el === "maintenanceActivitiesPerSystem") {
      pageNumbers.maintenanceActivitiesPerSystem = lastNo + 1;
      lastNo +=
        actvsPerTypeBreakIndexs == 0 ? 1 : actvsPerTypeBreakIndexs?.length + 2;
    }
    if (el === "depositionsDiagram") {
      pageNumbers.depositionsDiagram = lastNo + 1;
      // lastNo +=
      //   actvsPerTypeBreakIndexs == 0
      //     ? 1
      //     : actvsPerTypeBreakIndexs?.length + 2;
    }
  });
  setPageNumbering(pageNumbers);
};

export const getUniquePropertyCodes = (data) => {
  const result = {};

  data.forEach((item) => {
    item.documents.forEach((doc) => {
      const { property_code, building_code } = doc;
      if (!result[property_code]) {
        result[property_code] = new Set();
      }
      result[property_code].add(building_code);
    });
  });

  return Object.keys(result).map((propertyCode) => ({
    propertyCode,
    buildingCodes: Array.from(result[propertyCode]),
  }));
};

export const uniquePropertyAndBuildings = (
  maintainancePlan,
  value,
  setUniquePropsAndBuilds
) => {
  let uniqueCodes = getUniquePropertyCodes(maintainancePlan || []);
  console.log("uniqueCodes", uniqueCodes);

  let propsAndBuilds = [];
  uniqueCodes?.map((el) => {
    let foundP = value?.find((p) => p?.property_code === el?.propertyCode);
    propsAndBuilds.push({
      property: foundP,
      buildingCodes: el?.buildingCodes,
    });
  });

  console.log("propsAndBuilds", propsAndBuilds);
  setUniquePropsAndBuilds(propsAndBuilds);
};

function splitString(str, maxLength) {
  let result = [];
  for (let i = 0; i < str?.length; i += maxLength) {
    result.push(str?.slice(i, i + maxLength));
  }
  return result;
}

// Split the string into chunks of 800 characters

export const getMaintenanceReport = async (setMaintenanceReport) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await api.get(`/maintenance-report/${user?._id}`);
    // const chunks = splitString(res?.data?.value, 1500);
    //debugger;
    setMaintenanceReport(res?.data);
  } catch (error) {
    console.log(error);
  }
};

export const getAllMaintenanceDiagramData = async (
  setMaintananceDiagramData
) => {
  let a = new Date().getFullYear() + 100;
  let b = new Date().getFullYear() - 100;

  const user = JSON.parse(localStorage.getItem("user"));
  //   setLoading(true);
  try {
    let allMaintenancePlan = await api.post(
      `/planning_component/maintainance/analysis/${
        user?._id
      }/?system_name=${true}`
    );
    //debugger;
    setMaintananceDiagramData({
      labels: allMaintenancePlan?.data?.labels,
      datasets: allMaintenancePlan?.data?.data,
    });
    // setLoading(false);
  } catch (error) {
    console.log(error);
  }
};

export const getMaintenanceDepositionData = async (setDepositionData) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const res = await api.get(`/maintenance_depositions/${userData._id}`);
    setDepositionData(res?.data);
  } catch (error) {
    console.log(error);
    // setLoading(false);
  }
};

export const getMaintenanceSettings = async (setMaintenanceSettings) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const res = await api.get(`/maintenance_settings/${userData._id}`);
    setMaintenanceSettings(res?.data);
  } catch (error) {
    console.log(error);
    // setLoading(false);
  }
};

export const getUsystems = async (setUsystems) => {
  try {
    let all_u_systems = await api.get(`/u_systems?analysis=true`);
    setUsystems(all_u_systems?.data);
  } catch (error) {
    console.log(error);
  }
};
