// Imports
import express from "express";
import ComponentPackages from "../../models/componentPackage.js";
const router = express.Router();

// Fetching ComponentPackage
router.get("/", async (req, res) => {
  try {
    let tenantId =
      req?.user?.role === "user"
        ? req?.user?.tenantId?.toString()
        : req?.user?._id?.toString();
    const componentPackages = await ComponentPackages.find({
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    }).populate("Components");
    return res.status(200).json(componentPackages);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/unique", async (req, res) => {
  try {
    // const uniqueValues = await ComponentPackages.distinct("component_package");
    let tenantId = req?.user?._id?.toString();
    const uniqueValues = await ComponentPackages.find({
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    }).distinct("component_package");
    return res.status(200).json(uniqueValues);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching ComponentPackage by Package Name
router.post("/name", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();

    const componentPackage = await ComponentPackages.find({
      component_package: req.body.id,
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    });
    return res.status(200).json(componentPackage);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// Deleting ComponentPackage
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await ComponentPackages.findByIdAndDelete(id);
    return res.status(200).json("Component Package deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Adding ComponentPackages
router.post("/", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();
    req.body.tenantId = tenantId;
    const componentPackages = await ComponentPackages.create(req.body);
    return res.status(200).json(componentPackages);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Editing ComponentPackages
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newComponentPackage = await ComponentPackages.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    ).populate("Components");
    return res.status(200).json(newComponentPackage);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Editing ComponentPackages
router.patch("/moveRow/ToComponentPkg", async (req, res) => {
  try {
    const { componentId, packageId } = req.body;
    // console.log(" componentId, packageId", componentId, packageId);
    let query;
    if (req.body.type == "remove") {
      query = {
        $pull: { Components: componentId },
      };
    } else {
      // console.log("2nd one");
      query = {
        $push: { Components: componentId },
      };
    }
    const newComponentPackage = await ComponentPackages.findByIdAndUpdate(
      packageId,
      query,
      {
        new: true,
      }
    ).populate("Components");
    return res.status(200).json(newComponentPackage);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Export
export default router;
