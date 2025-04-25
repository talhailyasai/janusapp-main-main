// Imports
import express from "express";
import MaintenanceDepositions from "../../models/maintenanceDepositions.js";
import Planning from "../../models/Planning.js";
import MaintenanceSetting from "../../models/maintenanceSetting.js";
import { currValueFund } from "./depositionHelper.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const router = express.Router();

// Fetching MaintainceSettings
router.get("/:id", async (req, res) => {
  try {
    const maintainceDeposition = await MaintenanceDepositions.findOne({
      tenantId: req.params.id,
    });

    return res.status(200).json(maintainceDeposition);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    //  document find and store new variable
    let doc = await MaintenanceDepositions.findOne({
      tenantId: req.body.user,
    });
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    let decodedUser = jwt.decode(token, process.env.JWT_SECRET);

    let startValueFund;
    let current_deposition;
    let recommended_deposition;
    console.log("req.query", req.query.editSetting);
    if (req.query.editSetting == "true") {
      startValueFund = doc?.start_value_fund;
      current_deposition = doc?.current_deposition;
      recommended_deposition = doc?.recommended_deposition;
    } else {
      startValueFund = req.body.start_value_fund;
      current_deposition = req.body.current_deposition;
      recommended_deposition = req.body.recommended_deposition;
    }

    req.body.start_value_fund = startValueFund;
    req.body.current_deposition = current_deposition;
    req.body.recommended_deposition = recommended_deposition;

    // create new document
    const maintainceSetting = await MaintenanceSetting.findOne({
      tenantId: req.body.tenantId,
    });

    const startYear = maintainceSetting?.plan_start_year;
    const endYear =
      maintainceSetting?.plan_start_year + maintainceSetting?.plan_duration - 1;
    const data = await Planning.aggregate([
      {
        $match: {
          start_year: { $gte: startYear, $lte: endYear },
          tenantId: ObjectId(decodedUser.id),
        },
      },
      {
        $addFields: {
          adjustedCost: {
            $cond: [
              {
                $and: [
                  { $eq: ["$invest_flag", true] },
                  { $ne: ["$invest_percentage", null] },
                  { $ne: ["$invest_percentage", ""] },
                ],
              },
              {
                $subtract: [
                  "$total_cost",
                  {
                    $multiply: [
                      "$total_cost",
                      { $divide: [{ $toDouble: "$invest_percentage" }, 100] },
                    ],
                  },
                ],
              },
              "$total_cost",
            ],
          },
        },
      },
      {
        $match: {
          $or: [
            { invest_flag: { $ne: true } },
            {
              $and: [
                { invest_flag: true },
                { invest_percentage: { $ne: null } },
                { invest_percentage: { $ne: "" } },
              ],
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          totalCostSum: { $sum: "$adjustedCost" },
        },
      },
    ]);

    let totalCostSum = data?.length > 0 ? data[0].totalCostSum : 0;

    const avgCost = Math.round(totalCostSum / maintainceSetting?.plan_duration);
    // console.log("maintain data >> 100", totalCostSum, startYear, endYear,maintainceSetting?.plan_duration, "avgCost", avgCost, "data >", data);

    req.body.average_yearly_maintenance_costs = avgCost;
    const years = maintainceSetting?.plan_duration + 1;

    let depositionArray = await currValueFund(
      startYear,
      endYear,
      parseInt(startValueFund),
      parseInt(current_deposition),
      years,
      parseInt(recommended_deposition),
      decodedUser?.id
    );

    req.body.depositions = depositionArray;

    const arrayLastElement = depositionArray[depositionArray?.length - 1];

    req.body.end_value_fund = arrayLastElement?.curr_value_fund;

    req.body.end_value_fund_recommended = arrayLastElement?.rec_value_fund;

    //  document present then delete and create new
    const deletedDocument = await MaintenanceDepositions.findOneAndDelete({
      tenantId: req.body.tenantId,
    });
    // document create
    const maintainceDeposition = await MaintenanceDepositions.create(req.body);
    return res.status(200).json(maintainceDeposition);
  } catch (err) {
    console.log("err", err);
    return res.status(500).json(err);
  }
});

// Export
export default router;
