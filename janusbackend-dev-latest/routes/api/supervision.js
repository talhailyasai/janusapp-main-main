// Imports
import express from "express";
const router = express.Router();
import Property from "../../models/Property.js";
import Building from "../../models/Building.js";
import Component from "../../models/Component.js";
import Activity from "../../models/Activity.js";

// const activiesByYears=(actvs)=>{

// }
function groupActivitiesByMonth(activities) {
  const monthActivities = {
    jan: [],
    feb: [],
    mar: [],
    apr: [],
    may: [],
    jun: [],
    jul: [],
    aug: [],
    sep: [],
    oct: [],
    nov: [],
    dec: [],
  };

  activities.forEach((activity) => {
    const { date, activity: activityValue } = activity;
    const month = new Date(date).getMonth();
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(new Date(date));

    if (monthActivities[monthName.toLowerCase()]) {
      if (activityValue) {
        // monthActivities[monthName.toLowerCase()].push(activityValue);
        monthActivities[monthName.toLowerCase()].push(activityValue[0]);
      }
    }
  });

  // Ensure each month property is an array
  for (const month in monthActivities) {
    if (!Array.isArray(monthActivities[month])) {
      monthActivities[month] = [];
    }
  }

  return monthActivities;
}

function groupActivitiesByWeek(activities) {
  // Initialize 52 weeks (1-52)
  const weekActivities = {};
  for (let i = 1; i <= 52; i++) {
    weekActivities[`week${i}`] = [];
  }

  activities.forEach((activity) => {
    const { date, activity: activityValue } = activity;
    const activityDate = new Date(date);

    // Get ISO week number (1-52)
    const weekNumber = getWeekNumber(activityDate);

    if (activityValue) {
      weekActivities[`week${weekNumber}`].push(activityValue[0]);
    }
  });

  return weekActivities;
}

// Helper function to get ISO week number
function getWeekNumber(date) {
  // Copy date to avoid modifying original
  const target = new Date(date.valueOf());

  // ISO week starts on Monday
  const dayNumber = (date.getDay() + 6) % 7;

  // Set to nearest Thursday (makes it easier to get ISO week)
  target.setDate(target.getDate() - dayNumber + 3);

  // Get first Thursday of the year
  const firstThursday = new Date(target.getFullYear(), 0, 1);
  if (firstThursday.getDay() !== 4) {
    firstThursday.setMonth(0, 1 + ((4 - firstThursday.getDay() + 7) % 7));
  }

  // Get week number
  const weekNumber =
    1 + Math.ceil((target - firstThursday) / (7 * 24 * 60 * 60 * 1000));

  return weekNumber;
}
function groupActivitiesByQuarter(activities) {
  const quarterActivities = {
    q1: [], // Jan-Mar
    q2: [], // Apr-Jun
    q3: [], // Jul-Sep
    q4: [], // Oct-Dec
  };

  activities.forEach((activity) => {
    const { date, activity: activityValue } = activity;
    const month = new Date(date).getMonth(); // 0-11

    if (activityValue) {
      // Determine quarter and add activity
      if (month <= 2) {
        // Jan-Mar
        quarterActivities.q1.push(activityValue[0]);
      } else if (month <= 5) {
        // Apr-Jun
        quarterActivities.q2.push(activityValue[0]);
      } else if (month <= 8) {
        // Jul-Sep
        quarterActivities.q3.push(activityValue[0]);
      } else {
        // Oct-Dec
        quarterActivities.q4.push(activityValue[0]);
      }
    }
  });

  return quarterActivities;
}

// Fetching Properties
router.get("/getAnalysis", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    let properties;
    if (req.user.role == "user") {
      properties = await Property.find({
        responsible_user: { $regex: new RegExp("^" + req?.user?.email, "i") },
        tenantId: req.user?.tenantId,
      });
    } else {
      properties = await Property.find({
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      }).sort("property_code");
    }

    let dupProperties = JSON.parse(JSON.stringify(properties));
    // console.log("dupProperties", dupProperties);
    let data = await Promise.all(
      dupProperties?.map(async (el) => {
        let buildings = await Building.find({
          property_code: el?._id,
          $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
        }).sort("building_code");

        let dupBuildings = JSON.parse(JSON.stringify(buildings));

        let comps = await Promise.all(
          dupBuildings?.map(async (build) => {
            let components = await Component.find({
              building_code: build?._id,
              $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
            }).sort("component_code");

            components = JSON.parse(JSON.stringify(components));
            let dupComps = await Promise.all(
              components?.map(async (c) => {
                let activities = await Activity.find({
                  component: c._id,
                  $or: [
                    { tenantId: tenantId },
                    { tenantId: { $exists: false } },
                  ],
                });
                let ac = {
                  monthly: groupActivitiesByMonth(activities),
                  weekly: groupActivitiesByWeek(activities),
                  quarterly: groupActivitiesByQuarter(activities),
                };
                return {
                  compCode: c?.long_name || c?.name,
                  long_name: c?.long_name,
                  u_system: c?.u_system,
                  responsible_user: c?.responsible_user,
                  attendance_interval_value: c?.attendance_interval_value,
                  attendance_interval_unit: c?.attendance_interval_unit,
                  maintenance_interval_value: c?.maintenance_interval_value,
                  maintenance_interval_unit: c?.maintenance_interval_unit,
                  attendance_plan_date: c?.attendance_plan_date,
                  maintenance_plan_date: c?.maintenance_plan_date,
                  ...ac,
                };
              })
            );
            return {
              building: build?.name,
              building_code: build?.building_code,
              Property: el?.name,
              property_code: el?.property_code,
              components: dupComps,
            };
            // return dupComps;
          })
        );

        // el.buildings = buildings;
        // el.comps = comps;
        return comps;
      })
    );
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export default router;
