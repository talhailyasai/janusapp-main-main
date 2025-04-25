// Imports
import express from "express";
import Building from "../../models/Building.js";
import Component from "../../models/Component.js";
import Property from "../../models/Property.js";
import { formatDate, handleCompStatus } from "../../utils/analysis.js";
import { deleteFileFromS3, multerUploadS3 } from "../../utils/s3Helper.js";
import Planning from "../../models/Planning.js";
import User from "../../models/User.js";
import SettingAddresses from "../../models/SettingAddresses.js";
import RentalObjects from "../../models/SettingRental.js";

const router = express.Router();

// Fetching buildings by property code
router.get("/:id", async (req, res) => {
  try {
    // console.log("propertysidebar");
    const mobile = req.query.mobile;
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();
    const propertyId = req.params.id;
    const property = await Property.findOne({
      _id: propertyId,
    });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    if (propertyId === "" || propertyId === undefined) {
      throw new Error("Undefined property code");
    }
    let buildings;
    if (req?.user?.role == "user") {
      if (mobile) {
        let buildingCodes = [];
        let assignComp = await Component.find({
          responsible_user: { $regex: new RegExp("^" + req?.user?.email, "i") },
        });
        buildingCodes = [...(assignComp?.map((el) => el?.building_code) || [])];
        let unqiueBuilCodes = [...new Set(buildingCodes)];
        const assignedProperty = await Property.find({
          responsible_user: { $regex: new RegExp("^" + req?.user?.email, "i") },
        });

        let cond = [
          {
            $or: [
              {
                responsible_user: {
                  $regex: new RegExp("^" + req?.user?.email, "i"),
                },
              },
              unqiueBuilCodes.length > 0 && {
                building_code: { $in: buildingCodes },
              },
              assignedProperty.length > 0 && {
                $or: [
                  { responsible_user: "" },
                  { responsible_user: { $exists: false } },
                ],
              },
              { property_code: propertyId },
            ].filter(Boolean),
          },
          { $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }] },
        ];
        // console.log("propertyId", propertyId);
        // console.log("cond", cond);

        buildings = await Building.find({
          // property_code: propertyId,
          $and: cond,
        }).sort("building_code");
      } else {
        if (req?.user?.isAccessAllProperty) {
          buildings = await Building.find({
            property_code: propertyId,
            tenantId: tenantId,
          }).sort("building_code");
        } else if (req?.user?.propertyAccess) {
          const accessibleProperties = req.user.propertyAccess
            .split(",")
            .map((p) => p.trim());
          if (accessibleProperties.includes(property?.property_code)) {
            buildings = await Building.find({
              property_code: propertyId,
              tenantId: tenantId,
            }).sort("building_code");
          } else {
            buildings = [];
          }
        } else {
          buildings = [];
        }
      }
    } else {
      buildings = await Building.find({
        property_code: propertyId,
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      }).sort("building_code");
    }
    // console.log("buildings", buildings);
    if (buildings.length < 0) return res.status(500).json("err.message");
    return res.status(200).json(buildings);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// Fetching building by id
router.get("/building-id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const building = await Building.findById(id);
    return res.status(200).json(building);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching building by builing code
router.get("/building-code/:id", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();
    const id = req.params.id;
    const building = await Building.findOne({
      building_code: id,
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    });
    return res.status(200).json(building);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Delting building
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log("id", req.params.id);
    let data = await Building.findByIdAndDelete(id);
    deleteFileFromS3(data?.image?.key);
    let tenantId =
      req?.user?.role === "user"
        ? req?.user?.tenantId?.toString()
        : req?.user?._id?.toString();
    // console.log("data?._id", data?._id);

    await Component.deleteMany({
      building_code: data?._id,
      tenantId,
    });
    await Planning.deleteMany({
      building_code: data?.building_code,
      tenantId,
    });
    // console.log("data?.building_code", data?.building_code);
    // console.log("tenantId", tenantId);
    await SettingAddresses.deleteMany({
      $and: [{ building: data?.building_code }, { tenantId: tenantId }],
    });
    await RentalObjects.deleteMany({
      $and: [{ building: data?.building_code }, { tenantId: tenantId }],
    });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Editing building
router.put("/:id", multerUploadS3.any(), async (req, res) => {
  try {
    let tenantId =
      req?.user?.role === "user"
        ? req?.user?.tenantId?.toString()
        : req?.user?._id?.toString();

    if (req.files?.length > 0) {
      req.body.image = {
        link: req.files[0]?.location,
        format: req.files[0]?.mimetype.split("/")[1] || "jpg",
        key: req.files[0]?.key,
        createdAt: new Date(),
      };
    }
    const id = req.params.id;
    const updatedBuilding = await Building.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // console.log(
    //   "updatedBuilding?.property_code",
    //   updatedBuilding?.property_code
    // );
    let up = await Building.aggregate([
      {
        $match: {
          property_code: updatedBuilding?.property_code,
          $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
        },
      },
      {
        $addFields: {
          area_bta_numeric: {
            $cond: {
              if: { $eq: [{ $type: "$area_bta" }, "string"] },
              then: { $toInt: "$area_bta" }, // Convert string to integer
              else: "$area_bta", // Keep it as is if it's already numeric
            },
          },
          area_bra_numeric: {
            $cond: {
              if: { $eq: [{ $type: "$area_bra" }, "string"] },
              then: { $toInt: "$area_bra" }, // Convert string to integer
              else: "$area_bra", // Keep it as is if it's already numeric
            },
          },
          area_boa_numeric: {
            $cond: {
              if: { $eq: [{ $type: "$area_boa" }, "string"] },
              then: { $toInt: "$area_boa" }, // Convert string to integer
              else: "$area_boa", // Keep it as is if it's already numeric
            },
          },
          area_loa_numeric: {
            $cond: {
              if: { $eq: [{ $type: "$area_loa" }, "string"] },
              then: { $toInt: "$area_loa" }, // Convert string to integer
              else: "$area_loa", // Keep it as is if it's already numeric
            },
          },
          area_heating_numeric: {
            $cond: {
              if: { $eq: [{ $type: "$area_a_temp" }, "string"] },
              then: { $toInt: "$area_a_temp" }, // Convert string to integer
              else: "$area_a_temp", // Keep it as is if it's already numeric
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAreaBta: { $sum: "$area_bta_numeric" },
          totalAreaBra: { $sum: "$area_bra_numeric" },
          totalAreaBoa: { $sum: "$area_boa_numeric" },
          totalAreaLoa: { $sum: "$area_loa_numeric" },
          totalAreaHeating: { $sum: "$area_heating_numeric" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the result
          totalAreaBta: 1, // Include the totalAreaBta field in the result
          totalAreaBra: 1, // Include the totalAreaBta field in the result
          totalAreaBoa: 1, // Include the totalAreaBta field in the result
          totalAreaLoa: 1, // Include the totalAreaBta field in the result
          totalAreaHeating: 1, // Include the totalAreaBta field in the result
        },
      },
    ]);
    await Property.findOneAndUpdate(
      {
        property_code: updatedBuilding?.property_code,
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      },
      {
        sum_area_bta: up[0]?.totalAreaBta,
        sum_area_bra: up[0]?.totalAreaBra,
        sum_area_boa: up[0]?.totalAreaBoa,
        sum_area_loa: up[0]?.totalAreaLoa,
        sum_area_heating: up[0]?.totalAreaHeating,
      }
    );

    return res.status(200).json(updatedBuilding);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Adding building
router.post("/", multerUploadS3.any(), async (req, res) => {
  try {
    // console.log("run");
    let tenantId =
      req?.user?.role == "user"
        ? req.user?.tenantId
        : req?.user?._id?.toString();
    // console.log("req.body in create buildings >>>>>>>", req.body);
    // Check for duplicate building_code first
    const duplicateBuilding = await Building.findOne({
      tenantId,
      building_code: req.body.building_code,
      property_code: req.body.property_code,
    });

    if (duplicateBuilding) {
      return res.status(400).json({
        error: true,
        message: `Building with this code already exists`,
      });
    }

    let admin = await User.findById(tenantId);
    let addedBuildings = await Building.find({ tenantId });
    if (
      addedBuildings?.length >= 15 &&
      (admin?.plan == "Standard" || admin?.canceledPlan == "Standard")
    ) {
      return res.status(400).json({
        maxUser: true,
        message:
          req?.user?.role == "user"
            ? "Please contact to your admin to upgrade the plan!"
            : `You can add maximum 15 buildings. If you want to add more please upgrade your plan to standard plus!`,
      });
    }
    if (
      addedBuildings?.length >= 50 &&
      (admin?.plan == "Standard Plus" || admin?.canceledPlan == "Standard Plus")
    ) {
      return res.status(400).json({
        maxUser: true,
        message: `You cannot add more than 50 buildings!`,
      });
    }

    if (req.files?.length > 0) {
      req.body.image = {
        link: req.files[0]?.location,
        format: req.files[0]?.mimetype.split("/")[1] || "jpg",
        key: req.files[0]?.key,
      };
    }
    req.body.tenantId = tenantId;
    const building = await Building.create(req.body);
    // let data = await building.populate("property_code");
    let data = await building.populate({
      path: "property_code",
      select: "name property_code legal_name",
    });
    if (req.body.street_address) {
      let zipCode = req.body.zip_code;

      if (zipCode) {
        zipCode = zipCode.toString().replace(/\s/g, "");
        if (!isNaN(zipCode)) {
          zipCode = Number(zipCode);
        } else {
          zipCode = undefined;
        }
      }

      let addressData = {
        tenantId: req.body.tenantId,
        address: req.body.street_address,
        zipCode: zipCode,
        building: req.body.building_code,
        property: data?.property_code?.property_code || data?.property_code,
      };

      // Save the address
      await SettingAddresses.create(addressData);
    }

    return res.status(201).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Fetching all buildings
router.get("/", async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  let buildings;
  try {
    let tenantId =
      req?.user?.role === "user"
        ? req?.user?.tenantId?.toString()
        : req?.user?._id?.toString();

    if (!page && !limit) {
      buildings = await Building.find({
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      }).populate("property_code");
    } else {
      buildings = await Building.find({
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      });
    }
    // console.log("buildings >>", buildings);
    return res.status(200).json(buildings);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/mobile/:propertyId", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user"
        ? req.user?.tenantId?.toString()
        : req?.user?._id?.toString();

    const propertyId = req.params.propertyId;
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    let buildings = [];

    const property = await Property.findOne({
      _id: propertyId,
      responsible_user: { $regex: new RegExp("^" + req?.user?.email, "i") },
    });

    if (req.user.role === "user") {
      // User role: Apply all the responsibility checks

      // Define the responsibility filter based on property responsibility
      const responsibilityFilter = property
        ? {
            $or: [
              {
                responsible_user: {
                  $regex: new RegExp("^" + req?.user?.email, "i"),
                },
              },
              { responsible_user: "" },
              { responsible_user: null },
              { responsible_user: { $exists: false } },
            ],
          }
        : {
            responsible_user: {
              $regex: new RegExp("^" + req?.user?.email, "i"),
            },
          };

      // 1st Check: Buildings with matching res_user or no res_user
      const buildingsWithDirectAccess = await Building.find({
        $and: [
          { tenantId: tenantId },
          { property_code: propertyId },
          responsibilityFilter,
        ],
      }).sort("building_code");

      buildings.push(...buildingsWithDirectAccess);

      // 2nd Check: Check components for all remaining buildings
      console.log("checking components");
      const allBuildings = await Building.find({
        tenantId: tenantId,
        property_code: propertyId,
      });

      // Filter out buildings already found
      const remainingBuildings = allBuildings.filter(
        (building) =>
          !buildings.some((b) => b._id.toString() === building._id.toString())
      );

      // Check components for remaining buildings
      for (const building of remainingBuildings) {
        const responsibilityFilter = property
          ? {
              $or: [
                {
                  responsible_user: {
                    $regex: new RegExp("^" + req?.user?.email, "i"),
                  },
                },
                { responsible_user: "" },
                { responsible_user: null },
                { responsible_user: { $exists: false } },
              ],
            }
          : {
              responsible_user: {
                $regex: new RegExp("^" + req?.user?.email, "i"),
              },
            };
        const hasRelevantComponent = await Component.findOne({
          building_code: building._id,
          ...responsibilityFilter,
        });

        if (hasRelevantComponent) {
          buildings.push(building);
        }
      }

      // 3rd Check: Check property responsibility for remaining buildings
      if (property) {
        // Get remaining buildings that haven't been added yet
        const stillRemainingBuildings = allBuildings.filter(
          (building) =>
            !buildings.some((b) => b._id.toString() === building._id.toString())
        );

        // Add buildings without responsible users
        const propertyBuildings = stillRemainingBuildings.filter(
          (building) =>
            !building.responsible_user ||
            building.responsible_user === "" ||
            building.responsible_user === null
        );

        buildings.push(...propertyBuildings);
      }
    } else {
      // Non-user role: Get all buildings of the property
      buildings = await Building.find({
        tenantId: tenantId,
        property_code: propertyId,
      }).sort("building_code");
    }

    // Remove duplicates if any
    buildings = [
      ...new Map(buildings.map((item) => [item._id, item])).values(),
    ];

    // Sort buildings if needed
    buildings = buildings.sort((a, b) => {
      if (a.building_code < b.building_code) return -1;
      if (a.building_code > b.building_code) return 1;
      return 0;
    });

    // Apply pagination after all checks and sorting
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedBuildings = buildings.slice(startIndex, endIndex);

    return res.status(200).json(paginatedBuildings);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/withComps/followup", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    let { toggle, mobile } = req.query;
    let queryDate;
    let deviation;
    if (toggle == "week") {
      futureDate.setDate(currentDate.getDate() + 6);
      queryDate = formatDate(futureDate);
      deviation = 6;
    } else {
      futureDate.setDate(currentDate.getDate() + 29);
      queryDate = formatDate(futureDate);
      deviation = 29;
    }
    console.log("req.user >>>", req.query);
    let buildings = [];
    if (req.user.role === "user") {
      // User role: Apply all the responsibility checks
      let allProperties = [];
      if (mobile) {
        allProperties = await Property.find({
          tenantId: tenantId,
        });
        const propertyIds = [];
        for (const property of allProperties) {
          propertyIds.push(property._id.toString());
        }

        const properties = await Property.find({
          responsible_user: { $regex: new RegExp("^" + req?.user?.email, "i") },
          tenantId: tenantId,
        });
        // Define the responsibility filter based on property responsibility
        const responsibilityFilter =
          properties?.length > 0
            ? {
                $or: [
                  {
                    responsible_user: {
                      $regex: new RegExp("^" + req?.user?.email, "i"),
                    },
                  },
                  { responsible_user: "" },
                  { responsible_user: null },
                  { responsible_user: { $exists: false } },
                ],
              }
            : {
                responsible_user: {
                  $regex: new RegExp("^" + req?.user?.email, "i"),
                },
              };

        // 1st Check: Buildings with matching res_user or no res_user
        const buildingsWithDirectAccess = await Building.find({
          $and: [
            { tenantId: tenantId },
            { property_code: { $in: propertyIds } },
            responsibilityFilter,
          ],
        })
          .sort("building_code")
          .populate("property_code");

        buildings.push(...buildingsWithDirectAccess);

        // 2nd Check: Check components for all remaining buildings
        console.log("checking components");
        const allBuildings = await Building.find({
          tenantId: tenantId,
          property_code: { $in: propertyIds },
        }).populate("property_code");

        // Filter out buildings already found
        const remainingBuildings = allBuildings.filter(
          (building) =>
            !buildings.some((b) => b._id.toString() === building._id.toString())
        );

        // Check components for remaining buildings
        for (const building of remainingBuildings) {
          const responsibilityFilter =
            properties?.length > 0
              ? {
                  $or: [
                    {
                      responsible_user: {
                        $regex: new RegExp("^" + req?.user?.email, "i"),
                      },
                    },
                    { responsible_user: "" },
                    { responsible_user: null },
                    { responsible_user: { $exists: false } },
                  ],
                }
              : {
                  responsible_user: {
                    $regex: new RegExp("^" + req?.user?.email, "i"),
                  },
                };
          const hasRelevantComponent = await Component.findOne({
            building_code: building._id,
            ...responsibilityFilter,
          });

          if (hasRelevantComponent) {
            buildings.push(building);
          }
        }

        // 3rd Check: Check property responsibility for remaining buildings
        if (properties?.length > 0) {
          // Get remaining buildings that haven't been added yet
          const stillRemainingBuildings = allBuildings.filter(
            (building) =>
              !buildings.some(
                (b) => b._id.toString() === building._id.toString()
              )
          );

          // Add buildings without responsible users
          const propertyBuildings = stillRemainingBuildings.filter(
            (building) =>
              !building.responsible_user ||
              building.responsible_user === "" ||
              building.responsible_user === null
          );

          buildings.push(...propertyBuildings);
        }
      } else {
        const propertyArray = req?.user?.propertyAccess
          ? req?.user?.propertyAccess.split(",").map((item) => item.trim())
          : [];

        let query = { tenantId: tenantId };

        // Add property filter if propertyArray exists
        if (propertyArray.length > 0) {
          query.property_code = { $in: propertyArray };
        }

        allProperties = await Property.find(query);

        const propertyIds = [];
        for (const property of allProperties) {
          propertyIds.push(property._id.toString());
        }
        buildings = await Building.find({
          $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
          property_code: { $in: propertyIds },
          latitude: { $exists: true },
          longitude: { $exists: true },
        }).populate("property_code");
      }
    } else {
      buildings = await Building.find({
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
        latitude: { $exists: true },
        longitude: { $exists: true },
      }).populate("property_code");
    }
    let b = JSON.parse(JSON.stringify(buildings));
    let buildingsData = await Promise.all(
      b?.map(async (el) => {
        let query = {};
        if (req.user?.role === "user" && mobile) {
          const building = await Building.findById(el?._id.toString());
          const property = await Property.findById(
            building?.property_code.toString()
          );

          const isResponsibleForBuilding =
            building?.responsible_user === req.user.email.toUpperCase();
          const isResponsibleForProperty =
            property?.responsible_user === req.user.email.toUpperCase();
          query = {
            building_code: el?._id,
            $and: [
              // Tenant check
              {
                $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
              },

              // Date check
              {
                $or: [
                  { attendance_next_date: { $lt: queryDate } },
                  { maintenance_next_date: { $lt: queryDate } },
                ],
              },

              // Responsibility check
              {
                $or: [
                  // Direct responsibility
                  {
                    responsible_user: {
                      $regex: new RegExp("^" + req?.user?.email, "i"),
                    },
                  },

                  // No responsible user AND (building or property responsibility)
                  ...(isResponsibleForBuilding || isResponsibleForProperty
                    ? [
                        {
                          responsible_user: { $in: ["", null] },
                        },
                      ]
                    : []),
                ],
              },
            ],
          };
        } else {
          query = {
            building_code: el?._id,
            $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
            $or: [
              { attendance_next_date: { $lt: queryDate } },
              { maintenance_next_date: { $lt: queryDate } },
            ],
          };
        }
        // if (req.user.role == "user") {
        //   query.responsible_user = req.user.email.toUpperCase();
        // }
        const comps = await Component.find(query)
          .populate("property_code")
          .populate("building_code");
        let { buildingStatus, updatedComps } = handleCompStatus(
          comps,
          deviation
        );
        el.buildingStatus = buildingStatus;
        el.components = updatedComps;

        // el.components = comps?.length;
        return el;
      })
    );
    return res.status(200).json(buildingsData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Export
export default router;
