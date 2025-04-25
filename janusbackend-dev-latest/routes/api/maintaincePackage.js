// Imports
import express from "express";
import MaintaincePackages from "../../models/MaintaincePackage.js";
const router = express.Router();
// Fetching MaintaincePackage
router.get("/", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();

    const maintaincePackage = await MaintaincePackages.find({
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    }).populate("MaintenanceItems");
    return res.status(200).json(maintaincePackage);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching unique MaintaincePackage
router.get("/unique", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();
    // const uniqueValues = await MaintaincePackages.distinct(
    //   "maintenance_package"
    // );
    const packages = await MaintaincePackages.find({
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    });
    let uniqueValues = packages?.map((el) => el?.maintenance_package);
    return res.status(200).json(uniqueValues);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching MaintaincePackage by Package Name
router.get("/name/:id", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();

    const maintaincePackage = await MaintaincePackages.find({
      maintenance_package: req.params.id,
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    });
    return res.status(200).json(maintaincePackage);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Deleting MaintaincePackage
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await MaintaincePackages.findByIdAndDelete(id);
    return res.status(200).json("MaintaincePackage deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Adding MaintaincePackages
router.post("/", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();
    req.body.tenantId = tenantId;
    const mpCreated = await MaintaincePackages.create(req.body);
    const maintaincePackage = await MaintaincePackages.findById(
      mpCreated?._id
    ).populate("MaintenanceItems");
    return res.status(200).json(maintaincePackage);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Editing MaintaincePackages
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newMaintaincePackage = await MaintaincePackages.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    ).populate("MaintenanceItems");
    return res.status(200).json(newMaintaincePackage);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Editing MaintaincePackages
router.patch("/moveRow/ToMaintenancePkg", async (req, res) => {
  try {
    const { maintenanceId, packageId } = req.body;
    let query;
    if (req.body.type == "remove") {
      query = {
        $pull: { MaintenanceItems: maintenanceId },
      };
    } else {
      query = {
        $push: { MaintenanceItems: maintenanceId },
      };
    }
    const newMaintaincePackage = await MaintaincePackages.findByIdAndUpdate(
      packageId,
      query,
      {
        new: true,
      }
    ).populate("MaintenanceItems");
    return res.status(200).json(newMaintaincePackage);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching MaintaincePackage by Package Name
router.get("/packageName/:id", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();

    const maintaincePackage = await MaintaincePackages.find({
      maintenance_package: req.params.id,
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    }).populate("MaintenanceItems");
    return res.status(200).json(maintaincePackage);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Export
export default router;
