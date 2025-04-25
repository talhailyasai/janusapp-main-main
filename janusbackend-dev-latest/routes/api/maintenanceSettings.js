// Imports
import express from "express";
import MaintenanceSetting from "../../models/maintenanceSetting.js";

const router = express.Router();

// Fetching MaintainceSettings
router.get("/:id", async (req, res) => {
  try {
    const maintainceSetting = await MaintenanceSetting.findOne({
      tenantId: req.params.id,
    });

    return res.status(200).json(maintainceSetting);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Adding Maintainance Settings
router.post("/", async (req, res) => {
  try {
    const maintainceSetting = await MaintenanceSetting.create(req.body);
    return res.status(200).json(maintainceSetting);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Editing Maintaince Settings
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const maintainceSetting = await MaintenanceSetting.findOneAndUpdate(
      { tenantId: id },
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json(maintainceSetting);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Export
export default router;
