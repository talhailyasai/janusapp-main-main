// Imports
import express from "express";
import Planning from "../../../../models/Planning.js";
import Building from "../../../../models/Building.js";
import Property from "../../../../models/Property.js";
import User from "../../../../models/User.js";
import uSystems from "../../../../models/uSystems.js";
import { customSortByCode } from "../../../../utils/analysis.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/filter", async (req, res) => {
  try {
    // const startYears = await Planning.distinct("start_year");

    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    const allPlan = await Planning.find({
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    }).distinct("start_year");

    const filteredStartYears = allPlan?.filter(
      (year) => year !== undefined && year !== null && year !== 0 && year !== ""
    );
    let updatePlan = filteredStartYears?.map((elem) => {
      if (elem < 1900) {
        return 1900;
      } else if (elem > 2100) {
        return 2100;
      } else {
        return elem;
      }
    });

    const maxStartYear = Math.max(...updatePlan);
    const minStartYear = Math.min(...updatePlan);
    // let tenantId = req?.user?._id?.toString();

    const articles = await Planning.aggregate([
      {
        $match: {
          $or: [
            { tenantId: mongoose.Types.ObjectId(tenantId) }, // Match the given tenantId
            { tenantId: { $exists: false } }, // Include entries where tenantId does not exist
          ],
        },
      },
      {
        $group: {
          _id: "$article", // Group by the 'article' field
          maintenance_activity: { $first: "$maintenance_activity" }, // Include one 'maintenance_activity' per article
        },
      },
      {
        $project: {
          _id: 0, // Exclude MongoDB's default _id
          article: "$_id", // Rename the grouped field to 'article'
          maintenance_activity: 1, // Include 'maintenance_activity'
        },
      },
    ]);
    console.log("first articles", articles?.length);

    // in future we will fetch system_name from Planning table too.
    const uSystemsFromPlanning = await Planning.find({
      $or: [
        { tenantId: tenantId }, // Match the given tenantId
        { tenantId: { $exists: false } }, // Include entries where tenantId does not exist
      ],
    }).distinct("u_system");
    const uSystem = await uSystems
      .find(
        { system_code: { $in: uSystemsFromPlanning } }, // Step 2: Match system_code with distinct u_system values
        "system_code system_name -_id" // Step 3: Include only 'system_code' and 'system_name'
      )
      .lean();

    const properties = await Property.find({
      // property_code: { $in: propertyCodes },
      name: { $exists: true },
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    }).select({ _id: 0, name: 1, property_code: 1 });
    const result = {
      articles: articles?.map(
        (el) => el.article + " " + el?.maintenance_activity?.split(" ")[0]
      ),
      uSystems: uSystem?.map(
        (el) => el.system_code + " " + el.system_name?.trim()
      ),
      analysisUSystem: [
        "SC1",
        "SC2",
        "SC3",
        "SC4",
        "SC5",
        "SC6",
        "SC7",
        "SC8",
        "SD1",
        "SD2",
        "SD3",
        "SD4",
        "SD5",
        "SD6",
        "SG5",
      ],
      start_year: {
        distinctValues: filteredStartYears,
        min: minStartYear,
        max: maxStartYear,
      },
      property: customSortByCode(properties, "property_code").map(
        (doc) => doc.property_code + " " + doc.name?.substring(0, 15)
      ),
    };
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});
router.post("/filter", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();
    const {
      page = 1,
      //  limit = 20,
      sort,
      id,
      order,
    } = req.query;
    // const startIndex = page - 1* limit;

    const filter = {};
    Object.entries(req.body).forEach(([key, value]) => {
      if (value.length > 0) filter[key] = { $in: value };
    });
    if (filter.start_year) {
      const [startYear, endYear] = req.body.start_year[0]
        .split("-")
        .map(Number);

      const years = [...Array(endYear - startYear + 1)]
        .map((_, index) => startYear + index)
        .concat([undefined, null]);

      filter.start_year = { $in: years };
    }
    // console.log("filter.properties", filter.properties);
    if (filter.properties) {
      const propertyCodes = await Property.find({
        name: filter.properties,
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      }).distinct("property_code");
      filter.property_code = { $in: propertyCodes };
    }
    const count = await Planning.countDocuments(filter);
    let planningFilter = {
      $and: [
        filter,
        {
          $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
        },
      ],
    };
    // console.log("filter", filter);
    let planning = await Planning.find(planningFilter);
    // console.log("planning", planning);

    // if (sort && id) {
    //   const sortOrder = order === "desc" ? -1 : 1;
    //   planning = planning.sort((a, b) => {
    //     const valueA = a[id];
    //     const valueB = b[id];

    //     if (typeof valueA === "number" && typeof valueB === "number") {
    //       return (valueA - valueB) * sortOrder;
    //     }

    //     if (typeof valueA === "string" && typeof valueB === "string") {
    //       return valueA.localeCompare(valueB) * sortOrder;
    //     }

    //     return String(valueA).localeCompare(String(valueB)) * sortOrder;
    //   });
    // }

    // const slicedPlanning = planning.slice(

    //   startIndex + parseInt(limit)
    // );
    // console.log("slicedPlanning...", slicedPlanning.length);

    const buildingCodes = [
      ...new Set(planning.map((item) => item.building_code)),
    ];
    const propertyCodes = [
      ...new Set(planning.map((item) => item.property_code)),
    ];
    const [buildings, properties] = await Promise.all([
      Building.find({
        building_code: { $in: buildingCodes },
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      }).select("name building_code"),
      Property.find({
        property_code: { $in: propertyCodes },
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      }).select("name property_code"),
    ]);
    // console.log(
    //   "planning >>>>>>",
    //   planning,
    //   "propertyCodes>>>",
    //   propertyCodes,
    //   "buildings >>>",
    //   buildings,
    //   "properties>>>>",
    //   properties
    // );

    const buildingMap = buildings.reduce((map, obj) => {
      map[obj.building_code] = obj.name;
      return map;
    }, {});
    const propertyMap = properties.reduce((map, obj) => {
      map[obj.property_code] = obj.name;
      return map;
    }, {});
    // console.log("propertyMap >>>", propertyMap);
    const results = planning.map((item) => ({
      ...item.toObject(),
      property_name: propertyMap[item.property_code],
      building_name: buildingMap[item.building_code],
    }));

    const pagination = {
      currentPage: parseInt(page),
      // pageSize: limit,
      totalCount: count,
      // totalPages: Math.ceil(count / limit),
    };
    return res.json({ pagination, data: results });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// ...........................
// Overview

router.post("/custom", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    const maintenancePlans = await Planning.find({
      u_system: req.body.System,
      start_year: req.body.currentYear,
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    });

    let propertyCodes = [];
    let buildingCodes = [];
    maintenancePlans.map(async (elem) => {
      propertyCodes.push(elem?.property_code);
      buildingCodes.push(elem?.building_code);
    });
    const properties = await Property.find({
      property_code: { $in: propertyCodes },
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    }).select(["name", "property_code"]);

    const buildings = await Building.find({
      building_code: { $in: buildingCodes },
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    }).select(["name", "building_code"]);

    const propertyMap = properties.reduce((map, obj) => {
      map[obj.property_code] = obj.name;
      return map;
    }, {});
    const buildingMap = buildings.reduce((map, obj) => {
      map[obj.building_code] = obj.name;
      return map;
    }, {});
    const results = maintenancePlans.map((item) => ({
      ...item.toObject(),
      property_name: propertyMap[item.property_code],
      building_name: buildingMap[item.building_code],
    }));

    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// SUpervision Planning Filter

router.get("/supervision-planning/filter", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();

    const users = await User.distinct("email");
    const propertyCodes = await Planning.distinct("property_code");
    const properties = await Property.find({
      property_code: { $in: propertyCodes },
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    }).select({ _id: 0, name: 1 });

    const result = {
      users: users,
      property: properties.map((doc) => doc.name),
    };
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

export default router;
