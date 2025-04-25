import overviewRouter from "./overview.js";
import express from "express";
import Planning from "../../../../models/Planning.js";
import Building from "../../../../models/Building.js";
import Property from "../../../../models/Property.js";
import USystems from "../../../../models/uSystems.js";
import { calculateTotalCost } from "../../../../utils/analysis.js";
import axios from "axios";
import MaintenanceSetting from "../../../../models/maintenanceSetting.js";
import {
  deleteFileFromS3,
  multerUploadS3,
} from "../../../../utils/s3Helper.js";
import mongoose from "mongoose";
import MaintainceItems from "../../../../models/MaintainceItems.js";

const router = express.Router();
router.use("/overview", overviewRouter);

// activites Year
router.post("/activitesPerYear", async (req, res) => {
  let tenantId =
    req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

  // Base filter
  let filter = {
    $and: [
      { start_year: { $exists: true } },
      { total_cost: { $exists: true } },
      {
        $or: [
          { tenantId: mongoose.Types.ObjectId(tenantId) },
          { tenantId: { $exists: false } },
        ],
      },
    ],
  };

  // Apply filters from the request
  for (const key in req.body.filters) {
    if (req.body.filters[key]?.length > 0) {
      // Special handling for boolean flags
      if (key === "flag") {
        const flagConditions = req.body.filters[key].map((flag) => ({
          [flag]: true, // e.g., { energy_flag: true }
        }));
        filter.$and.push({ $and: flagConditions });
      } else if (key === "start_year") {
        // Start year range filter
        const startYearRange = req.body.filters.start_year[0].split("-");
        const startYearStart = parseInt(startYearRange[0]);
        const startYearEnd = parseInt(startYearRange[1]);

        const expandedYears = Array.from(
          { length: startYearEnd - startYearStart + 1 },
          (_, i) => startYearStart + i
        );

        filter.$and.push({ start_year: { $in: expandedYears } });
      } else if (key === "properties") {
        // Property code filter
        const propertyNames = req.body.filters.properties;
        const propertyCodes = await Property.find({
          name: { $in: propertyNames },
          $or: [{ tenantId }, { tenantId: { $exists: false } }],
        }).select("property_code");

        filter.$and.push({
          property_code: {
            $in: propertyCodes.map((item) => item.property_code),
          },
        });
      } else {
        // Other filters
        filter.$and.push({ [key]: { $in: req.body.filters[key] } });
      }
    }
  }

  try {
    const data = await Planning.aggregate([
      {
        $match: filter, // Match documents based on filters
      },
      {
        $group: {
          _id: "$start_year", // Group by start year
          totalCost: { $sum: "$total_cost" }, // Sum total costs
          documents: { $push: "$$ROOT" }, // Push all matching documents
        },
      },
      {
        $sort: { _id: 1 }, // Sort by start year
      },
    ]);

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// activites Type
router.post("/activitesPertype", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    // Base filter
    let filter = {
      $and: [
        { start_year: { $exists: true } },
        { total_cost: { $exists: true } },
        {
          $or: [
            { tenantId: mongoose.Types.ObjectId(tenantId) },
            { tenantId: { $exists: false } },
          ],
        },
      ],
    };
    if (req.body.filters?.status?.length > 0) {
      req.body.filters.status = req.body.filters.status.map((status) =>
        status === "UTFöRD" ? "Utförd" : status
      );
    }
    // Apply filters from the request
    for (const key in req.body.filters) {
      if (req.body.filters[key]?.length > 0) {
        // Special handling for boolean flags
        if (key === "flag") {
          const flagConditions = req.body.filters[key].map((flag) => ({
            [flag]: true, // e.g., { energy_flag: true }
          }));
          filter.$and.push({ $and: flagConditions });
        } else if (key === "start_year") {
          // Start year range filter
          const startYearRange = req.body.filters.start_year[0].split("-");
          const startYearStart = parseInt(startYearRange[0]);
          const startYearEnd = parseInt(startYearRange[1]);

          const expandedYears = Array.from(
            { length: startYearEnd - startYearStart + 1 },
            (_, i) => startYearStart + i
          );

          filter.$and.push({ start_year: { $in: expandedYears } });
        } else if (key === "properties") {
          // Property code filter
          const propertyNames = req.body.filters.properties;
          const propertyCodes = await Property.find({
            name: { $in: propertyNames },
            $or: [{ tenantId }, { tenantId: { $exists: false } }],
          }).select("property_code");

          filter.$and.push({
            property_code: {
              $in: propertyCodes.map((item) => item.property_code),
            },
          });
        } else {
          // Other filters
          filter.$and.push({ [key]: { $in: req.body.filters[key] } });
        }
      }
    }

    // const data = await Planning.aggregate([
    //   {
    //     $match: filter, // Match documents based on filters
    //   },
    //   {
    //     $group: {
    //       _id: "$u_system", // Group by u_system
    //       totalCost: { $sum: "$total_cost" }, // Sum total costs
    //       documents: { $push: "$$ROOT" }, // Push all matching documents
    //     },
    //   },
    //   {
    //     $sort: { _id: 1 }, // Sort by u_system
    //   },
    // ]);

    const data = await Planning.aggregate([
      {
        $match: filter,
      },
      // Add lookup for buildings
      {
        $lookup: {
          from: "buildings", // collection name for buildings
          let: {
            buildingCode: "$building_code",
            tenantId: mongoose.Types.ObjectId(tenantId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$building_code", "$$buildingCode"] },
                    { $eq: ["$tenantId", "$$tenantId"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                building_code: 1,
                // Add other building fields you need
              },
            },
          ],
          as: "building_details",
        },
      },
      {
        $addFields: {
          building_details: { $arrayElemAt: ["$building_details", 0] },
        },
      },

      {
        $group: {
          _id: "$u_system",
          totalCost: { $sum: "$total_cost" },
          documents: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Map u_system names
    const allUSystems = await USystems.find({});
    const allDocs = data?.map((elem) => ({
      ...elem,
      uSystemName:
        (allUSystems?.find((item) => item.system_code === elem?._id) || {})
          ?.system_name || null,
    }));

    return res.status(200).json(allDocs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/edit-many", async function (req, res) {
  const filter = { _id: { $in: req.body.filter } };
  const update = req.body.update;
  try {
    // If article is coming, fetch price_per_unit from MaintainceItems
    if (update.article && !update.price_per_unit) {
      const maintainceItem = await MaintainceItems.findOne({
        article: update.article,
      });
      if (maintainceItem) {
        update.price_per_unit = maintainceItem?.price_per_unit;
      }
    }

    // Now handle the price and quantity calculations
    if (update.price_per_unit && update.quantity) {
      update.total_cost = update.price_per_unit * update.quantity;
      await Planning.updateMany(filter, update);
    } else if (update?.price_per_unit || update?.quantity) {
      const existingPlans = await Planning.find(filter);

      for (const plan of existingPlans) {
        const newPrice = update?.price_per_unit || plan?.price_per_unit;
        const newQuantity = update?.quantity || plan?.quantity || 1;

        // Calculate new total_cost
        const totalCost = Number(newPrice) * Number(newQuantity);

        // Update individual document with new total_cost
        await Planning.updateOne(
          { _id: plan._id },
          {
            ...update,
            total_cost: totalCost,
          }
        );
      }
    } else {
      // If neither price_per_unit nor quantity is updated
      await Planning.updateMany(filter, update);
    }

    let tenantId = req?.user?._id?.toString();

    const planning = await Planning.find(filter);

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

    const buildingMap = buildings.reduce((map, obj) => {
      map[obj.building_code] = obj.name;
      return map;
    }, {});
    const propertyMap = properties.reduce((map, obj) => {
      map[obj.property_code] = obj.name;
      return map;
    }, {});

    const result = planning.map((item) => ({
      ...item.toObject(),
      property_name: propertyMap[item.property_code],
      building_name: buildingMap[item.building_code],
    }));

    res.json({
      message: "Documents updated successfully",
      result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update documents", message: error.message });
  }
});
router.get("/:property_code/:building_code", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();

    const { building_code, property_code } = req.params;
    const { limit } = req.query;
    const building = await Building.findOne({
      building_code: building_code,
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    }).select("name");
    const property = await Property.findOne({
      property_code: property_code,
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    }).select("name");
    const planning = await Planning.find({
      building_code,
      property_code,
    }).limit(limit || 10);
    const planningWithProperty = await planning.map((item) => ({
      ...item._doc,
      property_name: property.name,
      building_name: building.name,
    }));
    return res.status(200).json(planningWithProperty);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// analysis
router.post("/analysis/:userId", async (req, res) => {
  let data = [];
  let yearsArray = [];

  // Finding maintenance setting
  const maintainceSetting = await MaintenanceSetting.findOne({
    tenantId: req.params.userId,
  });

  if (!maintainceSetting) {
    return res.status(200).json({
      status: "success",
      data: [],
      labels: [],
    });
  }

  const startYear = maintainceSetting.plan_start_year;
  const endYear =
    maintainceSetting.plan_start_year + maintainceSetting.plan_duration - 1;

  // Base filter
  let filter = {
    $and: [
      { start_year: { $exists: true } },
      { total_cost: { $exists: true } },
    ],
  };

  // Apply filters from the request
  for (const key in req.body.filters) {
    if (req.body.filters[key]?.length > 0) {
      if (key === "flag") {
        const flagConditions = req.body.filters[key].map((flag) => ({
          [flag]: true,
        }));
        filter.$and.push({ $and: flagConditions });
      } else if (key === "start_year") {
        const startYearRange = req.body.filters.start_year[0].split("-");
        const startYearStart = parseInt(startYearRange[0]);
        const startYearEnd = parseInt(startYearRange[1]);

        filter.$and.push({
          start_year: { $gte: startYearStart, $lte: startYearEnd },
        });
      } else if (key === "properties") {
        const propertyNames = req.body.filters.properties;
        const propertyCodes = await Property.find({
          name: { $in: propertyNames },
        }).select("property_code");

        filter.$and.push({
          property_code: {
            $in: propertyCodes.map((item) => item.property_code),
          },
        });
      } else if (key === "u_system") {
        filter.$and.push({
          u_system: { $regex: `^${req.body.filters.u_system}`, $options: "i" }, // Matches values starting with uSystemValue
        });
      } else {
        filter.$and.push({ [key]: { $in: req.body.filters[key] } });
      }
    }
  }

  // Application logic
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    filter.$and.push({
      $or: [
        { tenantId: mongoose.Types.ObjectId(tenantId) },
        { tenantId: { $exists: false } },
      ],
    });

    let allMaintenancePlan = await Planning.find(filter);

    for (let i = startYear; i <= endYear; i++) {
      yearsArray.push(i);
    }

    const systemCodes = [
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
    ];
    const allUSystems = await USystems.find({});

    systemCodes.forEach((code) => {
      const filteredItems = allMaintenancePlan?.filter((item) => {
        if (
          item.u_system?.includes(code) &&
          item?.start_year >= startYear &&
          item?.start_year <= endYear
        ) {
          return item;
        }
      });

      const totalCost = calculateTotalCost(filteredItems, yearsArray);

      data.push({
        label: req.query?.system_name
          ? `${code} ${
              allUSystems
                ?.find((item) => item?.system_code === code)
                ?.system_name?.substring(0, 18) || ""
            }`
          : code,
        backgroundColor: getBackgroundColor(code),
        data: totalCost,
      });
    });

    function getBackgroundColor(code) {
      switch (code) {
        case "SC1":
          return "#F6DF0B";
        case "SC2":
          return "#2F566C";
        case "SC3":
          return "#BE370D";
        case "SC4":
          return "#4371E9";
        case "SC5":
          return "#AC3EEF";
        case "SC6":
          return "#DB915B";
        case "SC7":
          return "#073031";
        case "SC8":
          return "#CFCCCF";
        case "SD1":
          return "#B8BA5F";
        case "SD2":
          return "#428740";
        case "SD3":
          return "#7A7A7A";
        case "SD4":
          return "#AC7104";
        case "SD5":
          return "#F793F9";
        case "SD6":
          return "#6FEAE2";
        case "SG5":
          return "#F66810";
        default:
          return "lightgray";
      }
    }

    return res.status(200).json({
      status: "success",
      data: data,
      labels: yearsArray,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

// Dynamic filter range
router.get("/filter-year-range", async (req, res) => {
  try {
    const data = await Planning.aggregate([
      {
        $group: {
          _id: null,
          minStartYear: { $min: "$start_year" },
          maxStartYear: { $max: "$start_year" },
        },
      },
      {
        $limit: 1,
      },
    ]);
    // console.log("data", data);

    return res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// activites year status
router.patch("/activites-year-status/:id", async (req, res) => {
  try {
    // console.log("req.params", req.params.id);
    // console.log("req.body", req.body.StatusName);

    const data = await Planning.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.StatusName,
      },
      { new: true }
    );
    // console.log("data", data);

    return res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// activites Year  Delete
router.delete("/activitesPerYear-delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleteMaintenancePlan = await Planning.findByIdAndDelete(id);
    deleteMaintenancePlan?.files?.map((el) => deleteFileFromS3(el?.key));

    let { activitesType } = req.query;

    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    let start_yearMatch = {
      start_year: deleteMaintenancePlan?.start_year,
      total_cost: { $exists: true },
      tenantId: tenantId,
    };
    let u_systemsMatch = {
      u_system: deleteMaintenancePlan?.u_system,
      $and: [
        { start_year: { $exists: true } },
        { total_cost: { $exists: true } },
      ],
      tenantId: tenantId,
    };

    let match =
      activitesType === "activitesType" ? u_systemsMatch : start_yearMatch;
    // console.log("match", match);
    const data = await Planning.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: activitesType === "activitesType" ? "$u_system" : "$start_year",
          totalCost: { $sum: "$total_cost" },
          documents: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// activites  Per Year  EDit
router.patch("/activitesPerYear-edit/:id", async (req, res) => {
  try {
    // console.log("req.params edit", req.params.id);
    const editMaintenancePlan = await Planning.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    return res.status(200).json(editMaintenancePlan);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// activites  Per Year  Copy
router.post("/activitesPerYear-copy", async (req, res) => {
  try {
    req.body.files = [];
    let tenantId = req?.user?._id?.toString();

    req.body.tenantId = tenantId;
    let craeteMaintenancePlan = await Planning.create(req.body);

    return res.status(200).json(craeteMaintenancePlan);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// activites  Per Year  Files
router.post(
  "/activitesPerYear-files/:id",
  multerUploadS3.any(),
  async (req, res) => {
    // console.log("req.files[0]", req.files[0]);
    try {
      // console.log(" req.files[0]", req.files[0]);
      const data = {
        $push: {
          files: [
            {
              image: req.files[0]?.location,
              name: req?.files[0]?.originalname,
              format: req.files[0]?.mimetype.split("/")[1] || "jpg",
              key: req.files[0]?.key,
            },
          ],
        },
      };

      let craeteImageFile = await Planning.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true }
      );

      return res.status(201).json(craeteImageFile);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export default router;
