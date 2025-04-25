import express from "express";
const router = express.Router();
import SettingBuilding from "../../models/SettingBuilding.js";
import U_Buildings from "../../models/u_buildings.js";

router.get("/", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();
    const doc = await U_Buildings.find();
    return res.status(200).json(doc);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    let tenanntId = req?.user?._id?.toString();

    req.body.tenantId = tenanntId;

    const doc = await SettingBuilding.create(req.body);
    return res.status(200).json(doc);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Export
export default router;
