// Imports
import express from "express";
import USystems from "../../models/uSystems.js";

const router = express.Router();
// Fetching USystems
router.get("/", async (req, res) => {
  try {
    let query = {};
    if (req.query?.analysis) {
      query = {
        system_code: {
          $in: [
            "SC1",
            "SC2",
            "SC3",
            "SC4",
            "SC5",
            "SC6",
            "SC7",
            "SC8",
            "SD1",
            "SD2",
            "SD3",
            "SD4",
            "SD5",
            "SD6",
            "SG5",
          ],
        },
      };
    }
    // console.log("query", query);
    const u_system = await USystems.find(query);
    return res.status(200).json(u_system);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Search
router.get("/search/:id", async (req, res) => {
  try {
    // console.log("params hai");
    if (req.params.id === "undefined" || !req.params.id) {
      const u_system = await USystems.find();
      return res.status(200).json(u_system);
    } else {
      const query = {
        $or: [
          { system_name: { $regex: req.params.id, $options: "i" } },
          { system_code: { $regex: req.params.id, $options: "i" } },
        ],
      };
      const items = await USystems.find(query);
      return res.status(200).json(items);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

// Deleting USystems
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await USystems.findByIdAndDelete(id);
    return res.status(200).json("USystems deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Adding USystems
router.post("/", async (req, res) => {
  try {
    const u_system = await USystems.create(req.body);
    return res.status(200).json(u_system);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Editing USystems
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newMaintainceItem = await USystems.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(newMaintainceItem);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Export
export default router;
