// Imports
import express from "express";
const router = express.Router();
import Planning from "../../models/Planning.js";
import MaintenanceSetting from "../../models/maintenanceSetting.js";

// Fetching Planning by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const planning = await Planning.findById(id);
    return res.status(200).json(planning);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching plan by property code
router.get("/property_code/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let tenantId = req?.user?._id?.toString();
    const building = await Planning.find({ property_code: id, tenantId });
    return res.status(200).json(building);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete("/bulk-delete", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Please provide id" });
    }

    const result = await Planning.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      message: `Successfully deleted ${result.deletedCount} items`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
// Deleting Planning
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await Planning.findByIdAndDelete(id);
    return res.status(200).json("Planning deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Adding Planning
router.post("/", async (req, res) => {
  try {
    let tenantId =
      req.user.role == "user" ? req.user?.tenantId : req?.user?._id?.toString();
    // console.log("req.query", req.query);
    if (req.query.upload) {
      // console.log("req.body", req.body);
      const plans = await Planning.create(req.body.data);
      return res.status(200).json(plans);
    }
    // console.log("outside");

    const maintainceSetting = await MaintenanceSetting.findOne({
      tenantId: tenantId,
    });
    // let data=req.body.data
    // let user=req.body.user
    // console.log("req.body?.data", req.body?.data);

    const planDuration = parseInt(maintainceSetting?.plan_duration);
    const planStartYear = parseInt(maintainceSetting?.plan_start_year);
    const planYearsInterval = planStartYear + planDuration;
    let planning;
    for (const el of req.body?.data) {
      if (el?.invest_flag && el?.invest_percentage) {
        let total_cost;
        total_cost =
          parseInt(el?.total_cost) -
          (parseInt(el?.invest_percentage) / 100) * parseInt(el?.total_cost);
        el.total_cost = total_cost;
      }

      let { start_year, technical_life } = el;
      let startYear_Duration =
        parseInt(start_year) + maintainceSetting?.plan_duration;

      // console.log("startYear_Duration", startYear_Duration);
      // console.log("start_year", start_year);
      // console.log(
      //   "maintainceSetting?.plan_duration",
      //   maintainceSetting?.plan_duration
      // );

      // req.body.user = undefined;
      // if (req.body.multiple) {
      // if (1 == 3) {
      //   planning = await Planning.create(req.body);
      // } else {
      if (req.body?.multiple && planDuration && planStartYear) {
        for (
          let year = parseInt(start_year);
          year <= planYearsInterval;
          year += parseInt(technical_life)
        ) {
          // planning = new Planning({
          //   ...el,
          //   start_year: year,
          //   tenantId,
          // });
          // planning = await planning.save();
          if (year >= planStartYear) {
            planning = await Planning.create({
              ...el,
              start_year: year,
              tenantId,
            });
          }
        }
      } else {
        // planning = new Planning({
        //   ...el,
        //   tenantId,
        // });
        // planning = await planning.save();
        if (planDuration && planStartYear) {
          planning = await Planning.create({ ...el, tenantId });
        }
      }
      // }
    }
    if (planDuration && planStartYear) {
      console.log("Plannign created >>>>>.");
      return res.status(200).json({
        success: true,
        data: planning,
      });
    } else {
      console.log("Plannign created >>>>>.");
      return res.status(200).json({
        success: false,
        data: planning,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Editing Planning
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newPlanning = await Planning.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(newPlanning);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Export
export default router;
