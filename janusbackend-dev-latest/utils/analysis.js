export const calculateTotalCost = (element, years) => {
  let thisYear = new Date().getFullYear();

  // let years = [];
  // for loop
  // for (let i = 0; i < 10; i++) {
  //   years.push(thisYear);
  //   thisYear++;
  // }

  let uniqueElement = element
    .filter(
      (obj, index) =>
        element.findIndex((item) => item.start_year === obj.start_year) ===
        index
    )
    ?.sort((a, b) => (a.start_year > b.start_year ? 1 : -1));

  let finalElement = [];
  uniqueElement?.map((el) => {
    let sameRecords = element?.filter(
      (ac4) => ac4?.start_year === el?.start_year
    );

    let sumSame = sameRecords.reduce(function (acc, obj) {
      return acc + obj.total_cost;
    }, 0);

    // let sumSameElement = sameRecords.reduce(function (acc, obj) {
    //   return acc + obj.total_cost;
    // }, 0);

    finalElement.push({
      year: el?.start_year,
      totalCost: sumSame,
      SC: el?.u_system,
    });
  });

  let finalData = years?.map((el) => {
    let element = finalElement.find((finalItem) => finalItem?.year === el);
    return element ? element?.totalCost : 0;
  });
  return finalData;
};

// Supervision follow-up
export const addDeviationToDate = (date, unit, interval, code, deviation) => {
  let nextDate = new Date(date);
  let currDate = new Date();
  currDate.setUTCHours(0, 0, 0, 0);

  let currDatePlusDev = new Date();

  let compStatus = "black";

  switch (unit) {
    case "D":
      // Add deviation to the next date
      nextDate.setDate(nextDate.getDate() + 1);
      //Add deviation to curr date
      currDatePlusDev.setDate(currDatePlusDev.getDate() + deviation);
      currDatePlusDev.setUTCHours(0, 0, 0, 0);
      if (nextDate < currDate) {
        compStatus = "red";
      } else if (nextDate <= currDatePlusDev) {
        compStatus = "yellow";
      } else if (nextDate > currDatePlusDev) {
        compStatus = "black";
      }
      break;
    case "V":
      // Add deviation to the next date
      nextDate.setDate(nextDate.getDate() + 1);
      //Add deviation to curr date
      currDatePlusDev.setDate(currDatePlusDev.getDate() + deviation);
      currDatePlusDev.setUTCHours(0, 0, 0, 0);

      if (nextDate < currDate) {
        compStatus = "red";
      } else if (nextDate <= currDatePlusDev) {
        compStatus = "yellow";
      } else if (nextDate > currDatePlusDev) {
        compStatus = "black";
      }
      break;
    case "M":
      // Add Weeks deviation to next date
      nextDate.setDate(nextDate.getDate() + parseInt(interval) * 7);
      // let currDatePlus7 = new Date();
      //Add 7days to curr date
      currDatePlusDev.setDate(currDatePlusDev.getDate() + deviation);
      currDatePlusDev.setUTCHours(0, 0, 0, 0);

      if (nextDate < currDate) {
        compStatus = "red";
      } else if (nextDate <= currDatePlusDev) {
        compStatus = "yellow";
      } else if (nextDate > currDatePlusDev) {
        compStatus = "black";
      }
      break;

    case "Å":
      // Add months deviation to the next date
      nextDate.setMonth(nextDate.getMonth() + parseInt(interval));
      // let currDatePlus30 = new Date();
      //Add 1month to curr date
      currDatePlusDev.setDate(currDatePlusDev.getDate() + deviation);
      if (nextDate < currDate) {
        compStatus = "red";
      } else if (nextDate <= currDatePlusDev) {
        compStatus = "yellow";
      } else if (nextDate > currDatePlusDev) {
        compStatus = "black";
      }
      break;
    default:
    // console.log("DONT MATCH...", code);
  }
  return compStatus;
};

export const handleCompStatus = (components, deviation) => {
  let comps = JSON.parse(JSON.stringify(components));
  let updatedComps;
  let buildingStatus = "black";
  // console.log("comps", comps);
  if (comps?.length > 0) {
    updatedComps = comps?.map((el) => {
      let attendanceStatus = "black";
      let maintenanceStatus = "black";

      if (el?.attendance_next_date || el?.maintenance_next_date) {
        if (el?.attendance_next_date) {
          attendanceStatus = addDeviationToDate(
            el?.attendance_next_date,
            el?.attendance_interval_unit,
            el?.attendance_interval_value,
            el?.component_code,
            deviation
          );
        }

        if (el?.maintenance_next_date) {
          maintenanceStatus = addDeviationToDate(
            el?.maintenance_next_date,
            el?.maintenance_interval_unit,
            el?.maintenance_interval_value,
            el?.component_code,
            deviation
          );
        }
      }

      if (attendanceStatus === "red" || maintenanceStatus === "red") {
        el.deviationStatus = "red";
      } else if (
        attendanceStatus === "yellow" ||
        maintenanceStatus === "yellow"
      ) {
        el.deviationStatus = "yellow";
      } else {
        el.deviationStatus = "black";
      }
      return el;
    });

    let redComps = updatedComps?.find((c) => c?.deviationStatus === "red");
    let yelloComps = updatedComps?.find((c) => c?.deviationStatus === "yellow");

    if (redComps) {
      buildingStatus = "red";
    } else if (yelloComps) {
      buildingStatus = "yellow";
    }
    return { buildingStatus, updatedComps };
  } else {
    return { buildingStatus, updatedComps: [] };
  }
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function customSortByCode(array, codeKey) {
  return array.sort((a, b) => {
    const aCode = a[codeKey];
    const bCode = b[codeKey];
    const isANumeric = !isNaN(parseInt(aCode));
    const isBNumeric = !isNaN(parseInt(bCode));

    if (isANumeric && isBNumeric) {
      // Both are numeric, sort numerically
      return parseInt(aCode) - parseInt(bCode);
    } else if (isANumeric) {
      // Numeric comes before non-numeric
      return -1;
    } else if (isBNumeric) {
      // Non-numeric comes after numeric
      return 1;
    } else {
      // Check that aCode and bCode are strings before calling toLowerCase
      if (typeof aCode === "string" && typeof bCode === "string") {
        return aCode.toLowerCase().localeCompare(bCode.toLowerCase());
      }
      // If either is not a string, treat it as equal or handle the case as needed
      return 0;
    }
  });
}
