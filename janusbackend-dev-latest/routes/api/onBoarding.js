import express from "express";
const router = express.Router();
import Building from "../../models/Building.js";
import Property from "../../models/Property.js";
import Planning from "../../models/Planning.js";
import User from "../../models/User.js";
import MaintenanceSetting from "../../models/maintenanceSetting.js";
import Component from "../../models/Component.js";

router.post("/supervision", async (req, res) => {
  try {
    const { properties } = req.body;
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    // Fetch current counts
    let [propertyCount, buildingCount, componentCount, userData] =
      await Promise.all([
        Property.countDocuments({ tenantId }),
        Building.countDocuments({ tenantId }),
        Component.countDocuments({ tenantId }),
        User.findById(tenantId).select("role plan"),
      ]);

    // Define the limits
    const limits = {
      Standard: {
        properties: 5,
        buildings: 15,
        components: 50,
      },
      "Standard Plus": {
        properties: 15,
        buildings: 50,
        components: 250,
      },
    };
    const defaultLimits = {
      properties: 15,
      buildings: 50,
      components: 250,
    };

    const currentLimits =
      limits[userData?.canceledPlan || userData?.plan] || defaultLimits;

    const createdProperties = [];

    for (const propertyData of properties) {
      let property = await Property.findOne({
        property_code: propertyData.property_code,
        tenantId,
      });

      if (property) {
        property = await Property.findByIdAndUpdate(
          property._id,
          { ...propertyData },
          { new: true }
        );
      } else {
        if (propertyCount >= currentLimits.properties) {
          return res.status(400).json({
            maxUser: true,
            message:
              req?.user?.role == "user"
                ? "Please contact your admin to upgrade the plan!"
                : admin?.plan == "Standard"
                ? "You can add maximum 5 properties. If you want to add more please upgrade your plan to Standard Plus!"
                : "You cannot add more than 15 properties!",
          });
        }
        property = await Property.create({ ...propertyData, tenantId });
        propertyCount++;
      }

      createdProperties.push(property);

      if (
        Array.isArray(propertyData?.buildingsArray) &&
        propertyData?.buildingsArray?.length > 0
      ) {
        for (const buildingData of propertyData.buildingsArray) {
          let building = await Building.findOne({
            property_code: property._id,
            building_code: buildingData?.building_code,
          });

          if (building) {
            building = await Building.findByIdAndUpdate(
              building._id,
              { ...buildingData, property_code: property._id },
              { new: true }
            );
          } else {
            if (buildingCount >= currentLimits.buildings) {
              return res.status(400).json({
                maxUser: true,
                message:
                  req?.user?.role == "user"
                    ? "Please contact your admin to upgrade the plan!"
                    : admin?.plan == "Standard"
                    ? "You can add maximum 15 buildings. If you want to add more please upgrade your plan to Standard Plus!"
                    : "You cannot add more than 50 buildings!",
              });
            }
            building = await Building.create({
              ...buildingData,
              property_code: property._id,
              tenantId,
            });
            buildingCount++;
          }

          if (
            Array.isArray(buildingData?.components) &&
            buildingData?.components?.length > 0
          ) {
            for (const componentData of buildingData.components) {
              if (componentCount >= currentLimits.components) {
                return res.status(400).json({
                  maxUser: true,
                  message:
                    req?.user?.role == "user"
                      ? "Please contact your admin to upgrade the plan!"
                      : admin?.plan == "Standard"
                      ? "You can add maximum 50 components. If you want to add more please upgrade your plan to Standard Plus!"
                      : "You cannot add more than 250 components!",
                });
              }
              await Component.create({
                ...componentData,
                property_code: property._id.toString(),
                building_code: building._id.toString(),
                tenantId,
              });
              componentCount++;
            }
          }
        }
      }
    }

    return res.status(201).json({ properties: createdProperties });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Add ON BOarding Maintenance Setting
router.post("/maintenance/settings", async (req, res) => {
  try {
    let setting = await MaintenanceSetting.findOne({
      tenantId: req.body.tenantId,
    });
    let maintainceSetting;
    if (setting) {
      // console.log("patch");
      maintainceSetting = await MaintenanceSetting.findOneAndUpdate(
        { tenantId: req.body.tenantId },
        req.body,
        {
          new: true,
        }
      );
    } else {
      // console.log("create");

      maintainceSetting = await MaintenanceSetting.create(req.body);
    }
    return res.status(200).json(maintainceSetting);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/account-stats", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    const [
      propertyCount,
      buildingCount,
      planningCount,
      componentCount,
      userData,
    ] = await Promise.all([
      Property.countDocuments({ tenantId }),
      Building.countDocuments({ tenantId }),
      Planning.countDocuments({ tenantId }),
      Component.countDocuments({ tenantId }),
      User.findById(tenantId).select("role plan"),
    ]);

    const limits = {
      Standard: {
        properties: 5,
        buildings: 15,
        components: 50,
      },
      "Standard Plus": {
        properties: 15,
        buildings: 50,
        components: 250,
      },
    };
    const defaultLimits = {
      properties: 15,
      buildings: 50,
      components: 250,
    };

    const currentLimits =
      limits[userData?.canceledPlan || userData?.plan] || defaultLimits;

    // Generate appropriate messages
    const messages = {
      properties:
        userData?.plan === "Standard"
          ? `You can add a maximum of ${currentLimits.properties} properties. If you want to add more, please upgrade your plan to Standard Plus!`
          : `You cannot add more than ${currentLimits.properties} properties!`,

      buildings:
        userData?.plan === "Standard"
          ? `You can add a maximum of ${currentLimits.buildings} buildings. If you want to add more, please upgrade your plan to Standard Plus!`
          : `You cannot add more than ${currentLimits.buildings} buildings!`,

      components:
        userData?.plan === "Standard"
          ? `You can add a maximum of ${currentLimits.components} components. If you want to add more, please upgrade your plan to Standard Plus!`
          : `You cannot add more than ${currentLimits.components} components!`,
    };

    // Add user-specific message variants
    const userMessages = {
      properties:
        req.user.role === "user"
          ? "Please contact to your admin to upgrade the plan!"
          : messages.properties,
      buildings:
        req.user.role === "user"
          ? "Please contact to your admin to upgrade the plan!"
          : messages.buildings,
      components:
        req.user.role === "user"
          ? "Please contact to your admin to upgrade the plan!"
          : messages.components,
    };

    return res.status(200).json({
      success: true,
      data: {
        propertyCount,
        buildingCount,
        componentCount,
        planningCount,
        role: userData?.role,
        plan: userData?.plan,
        limits: currentLimits,
        messages: userMessages,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error fetching tenant statistics",
      error: err.message,
    });
  }
});

// Change Status
router.patch("/change-status/:id", async (req, res) => {
  try {
    let data = await User.findByIdAndUpdate(
      req.params.id,
      { isFirstLogin: true },
      { new: true }
    );
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
router.post("/:id", async (req, res) => {
  try {
    const buildings = req.body?.propertiesData
      ?.map((item) => item.buildingsArray)
      .flat();
    // console.log("buildings", buildings);

    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    let admin = await User.findById(tenantId);

    // Get current counts
    let addedProperties = await Property.find({ tenantId });
    let addedBuildings = await Building.find({ tenantId });

    // Count new items to be added
    const newPropertiesCount =
      req.body?.propertiesData?.filter(async (propertyData) => {
        const exists = await Property.findOne({
          tenantId,
          $or: [
            { property_code: propertyData.property_code },
            { name: propertyData.name },
          ],
        });
        return !exists;
      }).length || 0;

    const buildingsData =
      req.body?.propertiesData?.map((item) => item.buildingsArray).flat() || [];
    const newBuildingsCount = buildingsData.length;
    // console.log(
    //   "newBuildingsCount >>>>>",
    //   newBuildingsCount,
    //   "newPropertiesCount >>>>",
    //   newPropertiesCount
    // );
    // Check limits for Standard plan
    if (admin?.plan === "Standard" || admin?.canceledPlan === "Standard") {
      if (addedProperties.length + newPropertiesCount > 5) {
        return res.status(400).json({
          maxUser: true,
          message:
            req?.user?.role === "user"
              ? "Please contact your admin to upgrade the plan!"
              : "You can add maximum 5 properties. Please upgrade your plan to Standard Plus!",
        });
      }

      if (addedBuildings.length + newBuildingsCount > 15) {
        return res.status(400).json({
          maxUser: true,
          message:
            req?.user?.role === "user"
              ? "Please contact your admin to upgrade the plan!"
              : "You can add maximum 15 buildings. Please upgrade your plan to Standard Plus!",
        });
      }
    }

    // Check limits for Standard Plus plan
    if (
      admin?.plan === "Standard Plus" ||
      admin?.canceledPlan === "Standard Plus"
    ) {
      if (addedProperties.length + newPropertiesCount > 15) {
        return res.status(400).json({
          maxUser: true,
          message: "You cannot add more than 15 properties!",
        });
      }

      if (addedBuildings.length + newBuildingsCount > 50) {
        return res.status(400).json({
          maxUser: true,
          message: "You cannot add more than 50 buildings!",
        });
      }
    }

    // Process maintenance plan
    if (req.body?.maintenancePlan?.length > 0) {
      const updatedMaintenancePlan = [];

      for (const plan of req.body.maintenancePlan) {
        // Check if property_code is in ObjectId format
        if (
          plan.property_code &&
          plan.property_code.match(/^[0-9a-fA-F]{24}$/)
        ) {
          // Find the property by _id
          const property = await Property.findById(plan.property_code);
          if (property) {
            // Update the plan with the actual property_code
            updatedMaintenancePlan.push({
              ...plan,
              property_code: property.property_code,
            });
            continue;
          }
        }
        // If no property found or property_code not in ObjectId format
        updatedMaintenancePlan.push(plan);
      }

      // Create maintenance plans with updated property_codes
      await Planning.create(updatedMaintenancePlan);
    }
    if (req.body?.propertiesData && req.body?.propertiesData.length > 0) {
      let createdProperties = [];

      // Process each property
      for (const propertyData of req.body.propertiesData) {
        let existingProperty = await Property.findOne({
          tenantId,
          $or: [
            { property_code: propertyData.property_code },
            { name: propertyData.name },
          ],
        });

        if (existingProperty) {
          createdProperties.push(existingProperty);
        } else {
          const newProperty = await Property.create({
            ...propertyData,
            tenantId,
          });
          createdProperties.push(newProperty);
        }
      }

      // Process buildings
      for (const building of buildings) {
        const matchedProperty = createdProperties?.find(
          (prop) => prop?.property_code === building?.property_code?.toString()
        );

        if (matchedProperty) {
          const existingBuilding = await Building?.findOne({
            tenantId,
            property_code: matchedProperty?._id,
            $or: [
              { building_code: building?.building_code },
              { name: building?.name },
            ],
          });

          if (!existingBuilding) {
            await Building.create({
              ...building,
              property_code: matchedProperty?._id,
              name: building?.building_name || building?.name,
              tenantId,
            });
          }
        }
      }
    }
    // if (req.body?.propertiesData && req.body?.propertiesData.length > 0) {
    //   let doc = await Property.create(req.body?.propertiesData);
    //   const allBuild = buildings.map((building) => {
    //     // console.log(building);
    //     const matchedDoc = doc.find(
    //       (prop) => prop?.property_code === building?.property_code?.toString()
    //     );
    //     return {
    //       ...building,
    //       property_code: matchedDoc?._id,
    //       name: building?.building_name || building?.name,
    //     };
    //   });
    //   await Building.create(allBuild);
    // }

    let data = await User.findByIdAndUpdate(
      req.params.id,
      { isFirstLogin: true },
      { new: true }
    );

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Export
export default router;
