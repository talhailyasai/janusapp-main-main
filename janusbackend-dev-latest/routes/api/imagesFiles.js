// Imports
import express from "express";
const router = express.Router();
import Property from "../../models/Property.js";
import Building from "../../models/Building.js";
import Component from "../../models/Component.js";
import Planning from "../../models/Planning.js";
import Activity from "../../models/Activity.js";

router.get("/", async (req, res) => {
  try {
    // console.log("entering");
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    // Find properties with non-empty propertyImage.link
    let properties;
    let allowedPropertyCodes = [];
    let propertyCodesList = [];

    if (req?.user?.role === "user") {
      if (!req.user.propertyAccess) {
        // If no property access, return empty results
        return res.status(200).json({
          properties: [],
          buildings: [],
          components: [],
          maintenancePlans: [],
          activities: [],
        });
      }
      allowedPropertyCodes = req.user.propertyAccess
        .split(",")
        .map((code) => code.trim());
      // console.log("allowedPropertyCodes", allowedPropertyCodes);
      properties = await Property.find({
        property_code: { $in: allowedPropertyCodes },
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      }).sort("property_code");
    } else {
      properties = await Property.find({
        "image.link": { $exists: true, $ne: "" },
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      });
    }

    // Add property_code and name to property image objects
    let transformedProperties = [];
    for (let property of properties) {
      transformedProperties?.push({
        ...property.toObject(),
        image: {
          ...property.image,
        },
        property_code: {
          ...property.toObject(),
        },
      });
    }
    properties = transformedProperties;

    // Find buildings
    let buildings;
    // console.log("properties", properties);

    if (req?.user?.role === "user") {
      for (let prop of properties) {
        if (prop?._id) {
          // Use property_code instead of _id
          propertyCodesList.push(prop._id);
        }
      }
      buildings = await Building.find({
        "image.link": { $exists: true, $ne: "" },
        property_code: { $in: propertyCodesList },
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      })
        .sort("property_code")
        .populate("property_code");
    } else {
      buildings = await Building.find({
        "image.link": { $exists: true, $ne: "" },
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      }).populate("property_code");
    }

    // Find components
    let components = await Component.find({
      "image.link": { $exists: true, $ne: "" },
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    }).populate("property_code");

    let activities;
    if (req?.user?.role === "user") {
      // console.log("propertyCodesList", propertyCodesList);
      activities = await Activity.find({
        "image.link": { $exists: true, $ne: "" },
        property: { $in: propertyCodesList },
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      })
        .populate("property")
        .lean();
    } else {
      activities = await Activity.find({
        "image.link": { $exists: true, $ne: "" },
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      })
        .populate("property")
        .lean();
    }
    // console.log("tenantId >>>", tenantId, "activities >>>", activities);
    // console.log("activities", activities);

    for (let activity of activities) {
      activity.property_code = activity.property; // Rename 'property' to 'property_code'
      delete activity.property; // Remove the original 'property' field
    }

    // Find maintenance plans
    let maintenancePlans = await Planning.find({
      "files.image": { $exists: true, $ne: "" },
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    });

    // Add property_code and name to maintenance plan image objects
    maintenancePlans = await Promise.all(
      maintenancePlans.flatMap(async (plan) => {
        // Find the property associated with the maintenance plan
        const property = await Property.findOne({
          property_code: plan.property_code,
        });

        // Map each image in the files array to a separate object
        return Object.values(plan.files).map((file) => ({
          _id: plan._id,
          tenantId: plan.tenantId,
          article: plan.article,
          maintenance_activity: plan.maintenance_activity,
          technical_life: plan.technical_life,
          u_system: plan.u_system,
          quantity: plan.quantity,
          unit: plan.unit,
          price_per_unit: plan.price_per_unit,
          total_cost: plan.total_cost,
          start_year: plan.start_year,
          building_code: plan.building_code,
          property_code: plan.property_code,
          status: plan.status,
          image: {
            link: file.image,
            name: file.name,
            createdAt: file.createdAt,
            format: file.format,
            key: file.key,
            _id: file._id,
          },
          property_code: {
            property_code: property?.property_code,
            name: property?.name,
          },
          __v: plan.__v,
          energy_flag: plan.energy_flag,
          type: plan.type,
        }));
      })
    );
    properties = properties?.filter((item) => item?.image?.link);
    buildings = buildings?.filter((item) => item?.image?.link);
    components = components?.filter((item) => item?.image?.link);
    activities = activities?.filter((item) => item?.image?.link);
    maintenancePlans = maintenancePlans?.filter((item) => item?.image?.link);

    // Flatten the resulting nested array
    maintenancePlans = maintenancePlans.flat();
    return res.status(200).json({
      properties,
      buildings,
      components,
      maintenancePlans,
      activities,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Deleting Images Files
router.patch("/:id", async (req, res) => {
  try {
    let deleteProperty;
    if (req.body.type === "Property") {
      console.log(req.params.id);
      deleteProperty = await Property.findByIdAndUpdate(
        req.params.id,
        { image: null },
        { new: true }
      );
    } else if (req.body.type === "Building") {
      deleteProperty = await Building.findByIdAndUpdate(
        req.params.id,
        { image: null },
        { new: true }
      );
    } else if (req.body.type === "Component") {
      deleteProperty = await Component.findByIdAndUpdate(
        req.params.id,
        { image: null },
        { new: true }
      );
    } else if (req.body.type === "Activity") {
      deleteProperty = await Activity.findByIdAndUpdate(
        req.params.id,
        { image: null },
        { new: true }
      );
    } else if (req.body.type === "Maintenance Plan") {
      deleteProperty = await Planning.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            files: {
              $or: [
                { _id: req.query.image_id }, // Match by _id if it exists
                { image: req.query.image_id }, // Match by image URL if _id is not present
              ],
            },
          },
        },
        {
          new: true, // Return the updated document
        }
      );
    }
    return res.status(200).json(deleteProperty);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Export
export default router;
