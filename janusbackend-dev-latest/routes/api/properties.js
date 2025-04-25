// Imports
import express from "express";
const router = express.Router();
import Property from "../../models/Property.js";
import User from "../../models/User.js";
import { deleteFileFromS3, multerUploadS3 } from "../../utils/s3Helper.js";
import Building from "../../models/Building.js";
import Component from "../../models/Component.js";
import mongoose from "mongoose";
import SettingAddresses from "../../models/SettingAddresses.js";
import RentalObjects from "../../models/SettingRental.js";
import { customSortByCode } from "../../utils/analysis.js";
import Planning from "../../models/Planning.js";

function removeNullValues(obj) {
  const filtered = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== "" && obj[key] !== "") {
      filtered[key] = obj[key];
    }
  }
  return filtered;
}

// Fetching Properties
router.get("/", async (req, res) => {
  let tenantId =
    req.user.role == "user"
      ? req.user?.tenantId?.toString()
      : req?.user?._id?.toString();
  const { page, limit, pagination } = req.query;
  console.log(req.query);
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || undefined;
  let properties;
  try {
    if (req?.user?.role === "user") {
      if (req?.user?.isAccessAllProperty) {
        properties = await Property.find({
          $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
        });
      } else {
        let propertyCodes = [];
        const userAssignedProperty = req?.user.propertyAccess?.split(",");

        const assignBuildings = await Building.find({
          responsible_user: { $regex: new RegExp("^" + req?.user?.email, "i") },
        });

        const assignComponents = await Component.find({
          responsible_user: { $regex: new RegExp("^" + req?.user?.email, "i") },
        });

        propertyCodes = [
          // ...(userAssignedProperty?.map((el) => el?.property_code) || []

          // ),
          ...userAssignedProperty,
          ...(assignBuildings?.map((el) => el?.property_code) || []),
          ...(assignComponents?.map((el) => el?.property_code) || []),
        ];

        let unqiuepropertycodes = [...new Set(propertyCodes)];

        if (!page && !limit) {
          properties = await Property.find({
            property_code: { $in: unqiuepropertycodes },
            $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
          });
        } else {
          properties = await Property.find({
            property_code: { $in: unqiuepropertycodes },
            $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
          })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);
        }
        // const userAssignedProperty = req?.user.propertyAccess?.split(",");
        // console.log("userAssignedProperty", userAssignedProperty);
        // properties = await Property.find({
        //   property_code: userAssignedProperty,
        //   $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
        // }).sort("property_code");
      }
    } else {
      // console.log(
      //   "(pageNumber - 1) * limitNumber",
      //   (pageNumber - 1) * limitNumber
      // );
      // console.log("limitNumber", limitNumber);
      properties = await Property.find({
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
        name: { $exists: true },
      })
        .skip(!pagination == false ? 0 : (pageNumber - 1) * limitNumber)
        .limit(!pagination == false ? 0 : limitNumber);
    }

    let allProp = properties?.filter((elem) => elem?.name);
    let array = [];
    await Promise.all(
      allProp?.map(async (prop) => {
        let buildingArray = [];
        let buildingCodes = [];
        let buildings = await Building.find({ property_code: prop._id });
        await Promise.all(
          buildings?.map(async (building) => {
            let components = await Component.find({
              building_code: building._id,
            });
            // console.log({ components_149_propert: components });
            let componentsArray = components.map((component) => ({
              ...component._doc,
            }));
            buildingArray.push({
              ...building?._doc,
              building_name: building.name,
              componentsArray: componentsArray,
            });
            if (req.query?.buildingCodes == "true") {
              buildingCodes.push(building?.building_code);
            }
          })
        );
        if (prop?._doc) {
          array.push({
            ...prop._doc,
            buildingsArray: buildingArray,
            ...(req.query?.buildingCodes == "true" && { buildingCodes }),
          });
        } else {
          array.push({
            ...prop,
            buildingsArray: buildingArray,
            ...((req.query?.buildingCodes == "true" ||
              req.query?.buildingCodes == "true?") && { buildingCodes }),
          });
        }
      })
    );

    // Sort the final array of properties and their buildings
    array = customSortByCode(array, "property_code").map((prop) => ({
      ...prop,
      buildingsArray: customSortByCode(prop.buildingsArray, "building_code"),
    }));

    return res.status(200).json(array);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Mobile Properties API
router.get("/mobile", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user"
        ? req.user?.tenantId?.toString()
        : req?.user?._id?.toString();
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const currentUser = req?.user?.email.toUpperCase();
    let properties = [];

    if (req.user.role === "user") {
      const allProperties = await Property.find({ tenantId: tenantId });
      // let i = 1;

      for (const prop of allProperties) {
        // Check 1: If property has matching responsible user
        if (prop?.responsible_user === currentUser) {
          properties.push(prop);
        } else {
          // Check 2: If any building of this property has matching responsible user
          const hasResponsibleBuilding = await Building.findOne({
            property_code: prop._id.toString(),
            responsible_user: currentUser,
          });
          if (hasResponsibleBuilding) {
            properties.push(prop);
          } else {
            const hasComponent = await Component.findOne({
              property_code: prop._id.toString(),
              responsible_user: currentUser,
            });

            if (hasComponent) {
              properties.push(prop);
            }
          }
        }
        // i++;
      }
    } else {
      // Non-user role: Get all properties of the tenant
      properties = await Property.find({ tenantId: tenantId });
    }

    // Remove duplicates if any
    properties = [
      ...new Map(properties.map((item) => [item._id, item])).values(),
    ];

    // Sort properties if needed
    properties = customSortByCode(properties, "property_code");

    // Apply pagination after all checks, deduplication and sorting
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedProperties = properties?.slice(startIndex, endIndex);

    return res.status(200).json(paginatedProperties);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
// Fetching property by property code
router.get("/property-code/:id", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user"
        ? req.user?.tenantId?.toString()
        : req?.user?._id?.toString();

    const id = req.params.id;
    // First try to find property with matching tenantId
    let property = await Property.findOne({
      property_code: id,
      tenantId: tenantId,
    });

    // If no property found with tenantId, then look for common property
    if (!property) {
      property = await Property.findOne({
        property_code: id,
        tenantId: { $exists: false },
      });
    }

    return res.status(200).json(property);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching property by latitude
router.get("/:id", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();
    const latitude = req.params.id;
    const property = await Property.findOne({
      latitude,
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    });
    return res.status(200).json(property);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching property by id
router.get("/property-id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const property = await Property.findById(id);

    return res.status(200).json(property);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Deleting property
router.delete("/:id", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();
    const id = req.params.id;
    let data = await Property.findByIdAndDelete(id);
    deleteFileFromS3(data?.image?.key);

    await Planning.deleteMany({
      property_code: data?.property_code,
      tenantId,
    });

    await Building.deleteMany({
      property_code: data?._id,
      tenantId,
    });
    await Component.deleteMany({
      property_code: data?._id,
      tenantId,
    });

    await SettingAddresses.deleteMany({
      $and: [{ property: data?.property_code }, { tenantId: tenantId }],
    });

    await RentalObjects.deleteMany({
      $and: [{ property: data?.property_code }, { tenantId: tenantId }],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Adding property
router.post("/", multerUploadS3.any(), async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();
    const newBody = removeNullValues(req.body);
    newBody.tenantId = tenantId;
    // Check for duplicate property_code first
    const duplicateProperty = await Property.findOne({
      tenantId,
      property_code: newBody.property_code,
    });

    if (duplicateProperty) {
      return res.status(400).json({
        error: true,
        message: `Property with this code already exists`,
      });
    }

    let admin = await User.findById(tenantId);
    let addedProperties = await Property.find({ tenantId });
    // if (!admin?.plan || admin?.plan == "Under Notice") {
    //   return res.status(400).json({
    //     maxUser: true,
    //     message:
    //       req?.user?.role == "user"
    //         ? "Please contact to your admin to upgrade the plan!"
    //         : `Please upgrade your plan to add properties!`,
    //   })
    // }
    if (
      addedProperties?.length >= 5 &&
      (admin?.plan == "Standard" || admin?.canceledPlan == "Standard")
    ) {
      return res.status(200).json({
        maxUser: true,
        message:
          req?.user?.role == "user"
            ? "Please contact to your admin to upgrade the plan!"
            : `You can add maximum 5 properties. If you want to add more please upgrade your plan to standard plus!`,
      });
    }
    if (
      addedProperties?.length >= 15 &&
      (admin?.plan == "Standard Plus" || admin?.canceledPlan == "Standard Plus")
    ) {
      return res.status(400).json({
        maxUser: true,
        message: `You cannot add more than 15 properties!`,
      });
    }

    if (req.files?.length > 0) {
      req.body.image = {
        link: req.files[0]?.location,
        format: req.files[0]?.mimetype.split("/")[1] || "jpg",
        key: req.files[0]?.key,
      };
    }

    // const existingProperty = await Property.findOne({
    //   tenantId,
    //   $or: [{ property_code: newBody.property_code }, { name: newBody.name }],
    // });

    // if (existingProperty) {
    //   return res.status(200).json(existingProperty);
    // }

    // If no existing property found, create new one
    const property = await Property.create(newBody);
    return res.status(200).json(property);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Editing property
router.put("/:id", multerUploadS3.any(), async (req, res) => {
  try {
    if (req.files?.length > 0) {
      req.body.image = {
        link: req.files[0]?.location,
        format: req.files[0]?.mimetype.split("/")[1] || "jpg",
        key: req.files[0]?.key,
        createdAt: new Date(),
        dimensions: req.files[0]?.size,
      };
    } else {
      req.body.image = null;
    }

    const id = req.params.id;
    // await Property.updateMany({}, { responsible_user: "" });
    const newProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(newProperty);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Fetch Specific User and Common properties
router.get("/all/unassign", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    const property = await Property.find({
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    });

    // Sort properties by `property_code` numerically
    const sortedProperty = customSortByCode(property, "property_code");
    // console.log("properties in unassign", sortedProperty)
    return res.status(200).json(sortedProperty);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

// Change Responsible User to All properties
// router.patch("/all/update", async (req, res) => {
//   try {
//     const property = await Property.updateMany(
//       { tenantId: req.user?._id },
//       req.body,
//       { new: true }
//     );

//   return res.status(200).json(property);
//   } catch (err) {
//   return res.status(500).json(err);
//   }
// });

// Add this new route
router.get("/all/codes", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user"
        ? req.user?.tenantId?.toString()
        : req?.user?._id?.toString();

    // Get all properties for this tenant
    const properties = await Property.find({
      $or: [{ tenantId }, { tenantId: { $exists: false } }],
    }).select("_id property_code");

    // Get property IDs and codes
    const propertyIds = properties.map((p) => p._id);
    const property_codes = properties
      .map((p) => p.property_code)
      .filter(Boolean);

    // Get all buildings that belong to these properties
    const buildings = await Building.find({
      property_code: { $in: propertyIds },
      $or: [{ tenantId }, { tenantId: { $exists: false } }],
    }).select("building_code");

    const building_codes = buildings
      .map((b) => b.building_code)
      .filter(Boolean);

    return res.status(200).json({
      property_codes: [...new Set(property_codes)],
      building_codes: [...new Set(building_codes)],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error fetching codes",
      error: err.message,
    });
  }
});

// Export
export default router;
