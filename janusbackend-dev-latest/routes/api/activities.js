// Imports
import express from "express";
const router = express.Router();
import Activity from "../../models/Activity.js";
import Component from "../../models/Component.js";
import { multerUploadS3 } from "../../utils/s3Helper.js";

const ChangeIntervalUnit = (previous_date, unit, interval) => {
  const date = new Date(previous_date);
  const numUnit = parseInt(unit);
  switch (interval) {
    case "D":
      date.setDate(date.getDate() + numUnit);
      break;
    case "V":
      date.setDate(date.getDate() + numUnit * 7);
      break;
    case "M":
      date.setMonth(date.getMonth() + numUnit);
      break;
    case "Å":
      date.setFullYear(date.getFullYear() + numUnit);
      break;
    default:
      break;
  }

  return date.toISOString().substr(0, 10);
};
// Fetching activities by component code
router.get("/:id", async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  let activities;
  try {
    const componentCode = req.params.id;
    let tenantId =
      req.user?.role === "user"
        ? req?.user?.tenantId?.toString()
        : req?.user?._id?.toString();
    if (!page && !limit) {
      activities = await Activity.find({
        component: componentCode,
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      }).sort("-date");
    } else {
      activities = await Activity.find({
        component: componentCode,
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      })
        .sort("-date")
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    }
    return res.status(200).json(activities);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching activity by id
router.get("/activity/:id", async (req, res) => {
  try {
    const activityId = req.params.id;
    const activity = await Activity.findById(activityId);
    return res.status(200).json(activity);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Adding activity
router.post("/", multerUploadS3.any(), async (req, res) => {
  try {
    const activityType = req.body.activity;
    let tenantId =
      req.user?.role === "user"
        ? req?.user?.tenantId?.toString()
        : req?.user?._id?.toString();
    // console.log("req.body.component", req.body.component);
    if (activityType === "Tillsyn") {
      const component = await Component.findOne({
        component_code: req.body.compCode,
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      });
      // console.log("component", component);
      if (component) {
        const updatedComponent = await Component.findOneAndUpdate(
          {
            component_code: req.body.compCode,
            $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
          },
          {
            attendance_lastest_date: req.body.date,
            attendance_next_date: ChangeIntervalUnit(
              req.body.date,
              component.attendance_interval_value,
              component.attendance_interval_unit
            ),
          }
        );
        // console.log("attendance");
        // console.log(
        //   ChangeIntervalUnit(
        //     req.body.date,
        //     component.attendance_interval_value,
        //     component.attendance_interval_unit
        //   )
        // );
        // console.log(updatedComponent);
      }
    } else if (activityType === "Skötsel") {
      const component = await Component.findOne({
        component_code: req.body.compCode,
        $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
      });

      if (component) {
        const updatedComponent = await Component.findOneAndUpdate(
          {
            component_code: req.body.compCode,
            $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
          },
          {
            maintenance_lastest_date: req.body.date,
            maintenance_next_date: ChangeIntervalUnit(
              req.body.date,
              component.maintenance_interval_value,
              component.maintenance_interval_unit
            ),
          }
        );
        // console.log("maintaince");
        // console.log(
        //   ChangeIntervalUnit(
        //     req.body.date,
        //     component.maintenance_interval_value,
        //     component.maintenance_interval_unit
        //   )
        // );
        // console.log(updatedComponent);
      }
    }
    if (req.files?.length > 0) {
      req.body.image = {
        link: req.files[0]?.location,
        format: req.files[0]?.mimetype.split("/")[1] || "jpg",
        key: req.files[0]?.key,
      };
    }
    req.body.tenantId = tenantId;
    // console.log("req.body in activity >>>>>>", req.body, req.files);
    // Handle the updated component as needed
    const activity = await Activity.create(req.body);
    return res.status(201).json(activity);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedActivity = await Activity.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedActivity);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Deleting activity
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Activity.findByIdAndDelete(id);
    return res.status(200).json({ message: "Activity deleted" });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Add Activites Image
router.post("/image", multerUploadS3.any(), async (req, res) => {
  try {
    let tenantId =
      req?.user?.role == "user"
        ? req.user?.tenantId
        : req?.user?._id?.toString();

    if (req.files?.length > 0) {
      req.body.image = {
        link: req.files[0]?.location,
        format: req.files[0]?.mimetype.split("/")[1] || "jpg",
        key: req.files[0]?.key,
      };
    }
    req.body.tenantId = tenantId;
    const data = await Activity.create(req.body);

    return res.status(201).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
// Export
export default router;
