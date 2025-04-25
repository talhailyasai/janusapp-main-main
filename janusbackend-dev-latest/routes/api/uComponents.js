// Imports
import express from "express";
import UComponents from "../../models/uComponents.js";

const router = express.Router();
// Fetching USystems
router.get("/", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();

    const u_components = await UComponents.find({
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    });
    return res.status(200).json(u_components);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/codes", async (req, res) => {
  try {
    const abbreviations = req.body.abbreviations;
    if (!Array.isArray(abbreviations)) {
      return res
        .status(400)
        .json({ message: "Abbreviations must be an array." });
    }

    const u_components = await UComponents.find({
      u_component_abbreviation: { $in: abbreviations },
    });

    return res.status(200).json(u_components);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Export
export default router;
