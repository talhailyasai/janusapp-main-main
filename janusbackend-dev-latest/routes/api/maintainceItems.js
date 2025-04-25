// Imports
import express from "express";
import MaintainceItems from "../../models/MaintainceItems.js";
import mongoose from "mongoose";
import MaintaincePackage from "../../models/MaintaincePackage.js";
const router = express.Router();
// Fetching MaintainceItems

router.post("/alternative", async (req, res) => {
  try {
    const maintainceItem = await MaintainceItems.find({
      article: { $in: req.body },
    });

    return res.status(200).json(maintainceItem);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();
    const filterCriteria = !req?.user?.accessRepubItem
      ? { source: { $ne: "REPAB" } }
      : {};
    const maintainceItem = await MaintainceItems.find({
      $or: [{ tenantId }, { tenantId: { $exists: false } }],
      ...filterCriteria,
    });

    return res.status(200).json(maintainceItem);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching MaintainceItems by article-code
router.get("/search/:id", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();
    const filterCriteria = !req?.user?.accessRepubItem
      ? { source: { $ne: "REPAB" } }
      : {};
    if (req.params.id === "undefined") {
      console.log("enter");
      const maintainceItem = await MaintainceItems.find({
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
        ...filterCriteria,
      });

      return res.status(200).json(maintainceItem);
    } else {
      const query = {
        $or: [
          { article: { $regex: req.params.id, $options: "i" } },
          { maintenance_activity: { $regex: req.params.id, $options: "i" } },
          // { tenantId: tenantId },
          // { tenantId: { $exists: false } },
        ],
        ...filterCriteria,
      };
      const items = await MaintainceItems.find(query).limit(10);
      return res.status(200).json(items);
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

// Deleting MaintainceItems
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await MaintainceItems.findByIdAndDelete(id);

    await MaintaincePackage.updateMany(
      { MaintenanceItems: id },
      { $pull: { MaintenanceItems: id } },
      {
        new: true,
      }
    );

    return res.status(200).json("MaintainceItems deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Adding MaintainceItems
router.post("/", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();
    req.body.tenantId = tenantId;
    const maintainceItem = await MaintainceItems.create(req.body);
    return res.status(200).json(maintainceItem);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Editing MaintainceItems
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newMaintainceItem = await MaintainceItems.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json(newMaintainceItem);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//updated rows order
router.patch("/updateRowsOrder/all", async (req, res) => {
  try {
    req.body?.updatedData.map(async (el) => {
      let newMaintainceItem = await MaintainceItems.findByIdAndUpdate(
        el?._id,
        el,
        {
          new: true,
        }
      );
    });

    return res.status(200).json("success");
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

// Export
export default router;
