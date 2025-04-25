// Imports
import express from "express";
import MaintenanceReport from "../../models/MaintenanceReport.js";
import { deleteFileFromS3, multerUploadS3 } from "../../utils/s3Helper.js";

const router = express.Router();

// Fetching MaintenanceReport
router.get("/:id", async (req, res) => {
  try {
    const report = await MaintenanceReport.findOne({
      tenantId: req.params.id,
    });

    return res.status(200).json(report);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Adding Maintainance Report
router.post("/", multerUploadS3.any(), async (req, res) => {
  try {
    let body = req.body;
    if (req.files?.length > 0) {
      body.image = req.files[0]?.location;
    }
    const report = await MaintenanceReport.create(body);
    return res.status(200).json(report);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Editing Maintaince Settings
router.patch("/:id", multerUploadS3.any(), async (req, res) => {
  try {
    const id = req.params.id;
    let body = req.body;
    if (req.files?.length > 0) {
      body.image = req.files[0]?.location;
    }
    const report = await MaintenanceReport.findOneAndUpdate(
      { tenantId: id },
      body,
      {
        new: true,
      }
    );
    return res.status(200).json(report);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Export
export default router;
