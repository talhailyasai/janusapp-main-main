// Imports
import express from "express";
const router = express.Router();
import Component from "../../models/Component.js";
import Notification from "../../models/Notification.js";

// Fetching components with notifications component codes
router.get("/", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();

    const notifications = await Notification.find({
      $or: [{ tenantId }, { tenantId: { $exists: false } }],
    });
    const components = await Promise.all(
      notifications.map((notification) => {
        return Component.find({ component_code: notification.component_code });
      })
    );
    return res.status(200).json(components);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// Deleting notification
router.delete("/:id", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();

    const id = req.params.id;
    await Notification.findOneAndDelete({ component_code: id, tenantId });
    return res.status(200).json("Notification deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Export
export default router;
