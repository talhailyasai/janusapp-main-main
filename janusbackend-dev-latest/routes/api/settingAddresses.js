import express from "express";
const router = express.Router();
import SettingAddresses from "../../models/SettingAddresses.js";

router.get("/", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();
    const doc = await SettingAddresses.find({
      tenantId,
    });
    return res.status(200).json(doc);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ADD Adressess
router.post("/", async (req, res) => {
  try {
    let tenanntId = req?.user?._id?.toString();
    req.body.tenantId = tenanntId;

    const doc = await SettingAddresses.create(req.body);
    return res.status(200).json(doc);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Editing Adressess
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = await SettingAddresses.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Deleting Adress
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let doc = await SettingAddresses.findByIdAndDelete(id);

    return res.status(200).json(doc);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Export
export default router;
