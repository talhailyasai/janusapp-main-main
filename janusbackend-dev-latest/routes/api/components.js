// Imports
import express from "express";
import Component from "../../models/Component.js";
import U_component from "../../models/uComponents.js";
import Property from "../../models/Property.js";
import User from "../../models/User.js";
import Building from "../../models/Building.js";
import { deleteFileFromS3, multerUploadS3 } from "../../utils/s3Helper.js";
import Activity from "../../models/Activity.js";

const router = express.Router();

// Fetching all components
router.get("/", async (req, res) => {
  let tenantId =
    req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

  const { page, limit, resUser } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;

  try {
    let components;
    if (req?.user?.role == "user") {
      let userProperties = await Property.find({
        responsible_user: { $regex: new RegExp("^" + req?.user?.email, "i") },
      });
      let pCodes = userProperties?.map((el) => el?._id?.toString());
      let uBuildings = await Building.find({
        property_code: { $in: pCodes },
      });
      let bCodes = uBuildings?.map((el) => el?._id?.toString());
      components = await Component.find({
        building_code: { $in: bCodes },
      }).populate(["building_code", "property_code"]);
    } else {
      components = await Component.find({
        $or: [{ tenantId }, { tenantId: { $exists: false } }],
      })
        .populate(["building_code", "property_code"])
        .skip(!page ? 0 : (pageNumber - 1) * limitNumber)
        .limit(!limit ? 0 : limitNumber);
    }
    let allComponents;
    if (resUser == false) {
      allComponents = components;
    } else {
      allComponents = await Promise.all(
        components?.map(async (elem) => {
          if (!elem?.responsible_user) {
            const buildingData = await Building.findOne({
              building_code: elem.building_code?.building_code,
              $or: [{ tenantId }, { tenantId: { $exists: false } }],
            });
            if (buildingData?.responsible_user) {
              return {
                ...elem.toObject(),
                responsible_user: buildingData?.responsible_user,
              };
            } else {
              const propertyData = await Property.findOne({
                property_code: elem.property_code?.property_code,
                $or: [{ tenantId }, { tenantId: { $exists: false } }],
              });
              return {
                ...elem.toObject(),
                responsible_user: propertyData?.responsible_user,
              };
            }
          } else {
            return elem;
          }
        })
      );
    }
    return res.status(200).json(allComponents);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Fetching all components  by filter
router.post("/supervison-filter", async (req, res) => {
  // console.log("req.body", req.body);
  try {
    let tenantId =
      req?.user?.role === "user"
        ? req?.user?.tenantId?.toString()
        : req?.user?._id?.toString();
    // console.log("req.body.filters", req.body.filters);

    // filter code
    let filter = {};
    for (const key in req.body.filters) {
      if (req.body.filters[key]?.length > 0)
        filter[key] = { $in: req.body.filters[key] };
    }
    // console.log("filter", filter);
    // console.log(
    //   "req.body.filters?.property_code",
    //   req.body.filters?.property_code
    // );

    if (req.body.filters?.property_code) {
      const property_name = await Property.find({
        property_code: req.body.filters.property_code,
      }).select("_id");
      // console.log("property_name", property_name);

      let properties = property_name.map((item) => item._id);
      // console.log("properties", properties);
      filter["property_code"] = {
        $in: properties,
      };
    }

    filter = {
      ...filter,
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    };
    // console.log("filter", filter);
    // const components = await Component.find(filter);
    const components = await Component.find(filter)
      .populate({
        path: "building_code",
        select: "building_code name",
        model: "buildings",
      })
      .populate({
        path: "property_code",
        select: "property_code name",
        model: "properties",
      });

    return res.status(200).json(components);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Fetching components by building id
router.get("/:id", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();
    const buildingId = req.params.id;
    let components;
    if (req?.user?.role == "user") {
      let buildings = await Building.find({
        responsible_user: { $regex: new RegExp("^" + req?.user?.email, "i") },
      });
      // console.log("buildings", buildings);
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

            (assignedProperty.length > 0 || buildings.length > 0) &&
              ({ responsible_user: "" },
              { responsible_user: { $exists: false } }),
            { building_code: buildingId },
          ].filter(Boolean),
        },
        { $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }] },
      ];
      components = await Component.find({
        // building_code: buildingId,
        $and: cond,
      })
        .sort("component_code")
        .populate("building_code");
    } else {
      components = await Component.find({
        building_code: buildingId,
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      })
        .sort("component_code")
        .populate("building_code");
    }

    return res.status(200).json(components);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/mobile/:buildingId", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user"
        ? req.user?.tenantId?.toString()
        : req?.user?._id?.toString();

    const buildingId = req.params.buildingId;
    const { page, limit } = req.query;
    const pageNumber = page ? parseInt(page) : undefined;
    const limitNumber = parseInt(limit) || 10;
    let components = [];

    if (req.user.role === "user") {
      const building = await Building.findOne({
        _id: buildingId,
      });
      const resBuilding =
        building?.responsible_user === req?.user?.email.toUpperCase()
          ? true
          : false;
      const property = await Property.findOne({
        _id: building?.property_code?.toString(),
        responsible_user: { $regex: new RegExp("^" + req?.user?.email, "i") },
      });

      // Define the responsibility filter based on property and building responsibility
      const responsibilityFilter =
        property || resBuilding
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

      // User role: Get components where user is responsible or no responsible user exists
      if (pageNumber) {
        components = await Component.find({
          $and: [
            { tenantId: tenantId },
            { building_code: buildingId },
            responsibilityFilter,
          ],
        })
          .populate("building_code")
          .sort("component_code")
          .skip((pageNumber - 1) * limitNumber)
          .limit(limitNumber);
      } else {
        components = await Component.find({
          $and: [
            { tenantId: tenantId },
            { building_code: buildingId },
            responsibilityFilter,
          ],
        })
          .populate("building_code")
          .sort("component_code");
      }
    } else {
      // Non-user role: Get all components of the building
      components = await Component.find({
        tenantId: tenantId,
        building_code: buildingId,
      })
        .populate("building_code")
        .sort("component_code")
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    }

    // Remove duplicates if any
    components = [
      ...new Map(components.map((item) => [item._id, item])).values(),
    ];

    // Sort components if needed
    components = components.sort((a, b) => {
      if (a.component_code < b.component_code) return -1;
      if (a.component_code > b.component_code) return 1;
      return 0;
    });

    return res.status(200).json(components);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Fetching components by component code
router.get("/component/:id", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    const componentId = req.params.id;
    const component = await Component.findOne({
      component_code: componentId,
      $or: [{ tenantId }, { tenantId: { $exists: false } }],
    });
    return res.status(200).json(component);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching components by component id
router.get("/component-id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const component = await Component.findById(id);

    return res.status(200).json(component);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Deleting component
router.delete("/:id", async (req, res) => {
  try {
    let tenantId =
      req?.user?.role === "user"
        ? req?.user?.tenantId?.toString()
        : req?.user?._id?.toString();
    const id = req.params.id;
    let doc = await Component.findByIdAndDelete(id);
    doc?.image?.key && deleteFileFromS3(doc?.image?.key);
    await Activity.deleteMany({ component: doc?.component_code, tenantId });

    return res.status(200).json(doc);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Editing component by id
router.patch("/:id", multerUploadS3.any(), async (req, res) => {
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
    } else {
      req.body.image = null;
    }

    const id = req.params.id;
    if (req.body.component_code) {
      const alreadyComponent = await Component.findOne({
        component_code: req.body.component_code,
        $or: [{ tenantId }, { tenantId: { $exists: false } }],
      });
      if (
        alreadyComponent &&
        alreadyComponent?._id.toString() !== req.body._id
      ) {
        return res
          .status(409)
          .json({ message: "Component code already exists" });
        return;
      }
    }
    const updatedComponent = await Component.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedComponent);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Editing component by component code
router.put("/component-code/:id", async (req, res) => {
  try {
    let tenantId =
      req?.user?.role === "user"
        ? req?.user?.tenantId?.toString()
        : req?.user?._id?.toString();
    const id = req.params.id;
    const updatedComponent = await Component.findOneAndUpdate(
      {
        component_code: id,
        $or: [{ tenantId }, { tenantId: { $exists: false } }],
      },
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedComponent);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

router.post("/", multerUploadS3.any(), async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();

    let admin = await User.findById(tenantId);
    let addedComponents = await Component.find({ tenantId });

    if (
      addedComponents?.length >= 50 &&
      (admin?.plan == "Standard" || admin?.canceledPlan == "Standard")
    ) {
      return res.status(400).json({
        maxUser: true,
        message:
          req?.user?.role == "user"
            ? "Please contact to your admin to upgrade the plan!"
            : `You can add maximum 50 components. If you want to add more please upgrade your plan to standard plus!`,
      });
    }
    if (
      addedComponents?.length >= 250 &&
      (admin?.plan == "Standard Plus" || admin?.canceledPlan == "Standard Plus")
    ) {
      return res.status(400).json({
        maxUser: true,
        message: `You cannot add more than 250 components!`,
      });
    }

    if (req.files?.length > 0) {
      req.body.image = {
        link: req.files[0]?.location,
        format: req.files[0]?.mimetype.split("/")[1] || "jpg",
        key: req.files[0]?.key,
      };
    }

    // console.log("req.body", req.body);
    let componentCode = req.body.component_code;
    let addTenantId = [];
    if (!componentCode) {
      for (let elem of req.body) {
        addTenantId.push({ ...elem, tenantId: tenantId });
      }
      req.body = addTenantId;
      const newComponent = await Component.create(req.body);

      if (newComponent?.length) {
        // newComponent.map(async (item) => {
        //   componentCode = await item._id.toString().slice(-6).toUpperCase();
        //   await Component.findByIdAndUpdate(item._id, {
        //     component_code: componentCode,
        //   });
        // });
        for (let item of newComponent) {
          componentCode = item._id.toString().slice(-6).toUpperCase();
          await Component.findByIdAndUpdate(item._id, {
            component_code: componentCode,
          });
        }
      } else {
        componentCode = await newComponent._id
          .toString()
          .slice(-6)
          .toUpperCase();

        await Component.findByIdAndUpdate(newComponent._id, {
          component_code: componentCode,
        });
      }
      return res.status(200).json(newComponent);
    } else {
      req.body.tenantId = tenantId;
      const newComponent = await Component.create(req.body);
      return res.status(200).json(newComponent);
    }
  } catch (err) {
    console.log("err", err);
    return res.status(500).json(err.message);
  }
});

// Data settins components
router.get("/datasettings/all", async (req, res) => {
  try {
    let tenantId =
      req?.user?.role === "user"
        ? req?.user?.tenantId?.toString()
        : req?.user?._id?.toString();
    const components = await U_component.find({
      $or: [{ tenantId }, { tenantId: { $exists: false } }],
    });
    return res.status(200).json(components);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching datasetting components by component code
router.get("/datasettings/component/:id", async (req, res) => {
  try {
    let tenantId =
      req?.user?.role === "user"
        ? req?.user?.tenantId?.toString()
        : req?.user?._id?.toString();
    const componentId = req.params.id;
    const component = await U_component.findOne({
      component_code: componentId,
      $or: [{ tenantId }, { tenantId: { $exists: false } }],
    });
    return res.status(200).json(component);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Deleting datasetting component
router.delete("/datasettings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await U_component.findByIdAndDelete(id);
    return res.status(200).json("Component deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});
// Editing datasetting component by id
router.patch("/datasettings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedComponent = await U_component.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedComponent);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/datasettings", async (req, res) => {
  try {
    let tenantId =
      req?.user?.role === "user"
        ? req?.user?.tenantId?.toString()
        : req?.user?._id?.toString();
    req.body.tenantId = tenantId;
    const newComponent = await U_component.create(req.body);
    return res.status(200).json(newComponent);
  } catch (err) {
    console.log("err", err);
    return res.status(500).json(err.message);
  }
});
//updated rows order
router.patch("/datasettings/updateRowsOrder/all", async (req, res) => {
  try {
    req.body?.updatedData.map(async (el) => {
      let newMaintainceItem = await U_component.findByIdAndUpdate(el?._id, el, {
        new: true,
      });
    });

    return res.status(200).json("success");
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

// Editing component by id
router.patch("/update-changeby/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedComponent = await Component.findByIdAndUpdate(
      id,
      {
        responsible_user: req.body.value,
      },
      {
        new: true,
      }
    )?.populate("building_code");
    return res.status(200).json(updatedComponent);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/getusercomponents/:id", async (req, res) => {
  try {
    // console.log("req.params.id", req.params.id);
    // let tenantId = req?.user?._id?.toString();
    const user = await User.findById(req.params.id);
    // console.log("user", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let components;

    if (user?.tenantId) {
      components = await Component.find({
        tenantId: user.tenantId,
        $or: [
          // Case 1: Components directly assigned to user
          {
            responsible_user: {
              $regex: new RegExp("^" + user?.email, "i"),
            },
          },

          // Case 2: Components with empty/no responsible_user but parent has user as responsible
          {
            $and: [
              {
                $or: [
                  { responsible_user: "" },
                  { responsible_user: { $exists: false } },
                ],
              },
              {
                $or: [
                  // Check if property has user as responsible
                  {
                    property_code: {
                      $in: await Property.find({
                        responsible_user: {
                          $regex: new RegExp("^" + user?.email, "i"),
                        },
                        tenantId: user.tenantId,
                      }).distinct("_id"),
                    },
                  },
                  // Check if building has user as responsible
                  {
                    building_code: {
                      $in: await Building.find({
                        responsible_user: {
                          $regex: new RegExp("^" + user?.email, "i"),
                        },
                        tenantId: user.tenantId,
                      }).distinct("_id"),
                    },
                  },
                ],
              },
            ],
          },
        ],
      }).populate(["property_code", "building_code"]);
    } else {
      // let allComponents = [];

      // for (const user of allUsers) {
      //   const doc = await Component.find({
      //     changed_by: user?.email.toUpperCase(),
      //   });

      //   allComponents.push(doc);
      // }
      // const flattenedArray = [].concat(...allComponents);
      // console.log("flattenedArray", flattenedArray);
      // res.status(200).json(flattenedArray);
      // const allUsers = await User.find({ tenantId: user?._id });
      // const userEmails = allUsers?.map((user) => user.email.toUpperCase());

      components = await Component.find({
        tenantId: user?._id,
        // changed_by: {
        //   $in: userEmails,
        // },
        // $or: [{ tenantId }, { tenantId: { $exists: false } }],
      }).populate(["property_code", "building_code"]);
    }
    return res.status(200).json(components);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Export
export default router;
