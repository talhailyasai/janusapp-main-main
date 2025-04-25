import Planning from "../../models/Planning.js";
import { ObjectId } from "mongodb";

export const currValueFund = async (
  startYear,
  endYear,
  start_value_fund,
  current_deposition,
  years,
  rec_deposition,
  id,
) => {
  const yearsTotalCost = await Planning.aggregate([
    {
      $match: {
        start_year: { $gte: startYear, $lte: endYear },
        tenantId: ObjectId(id),
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
            { $subtract: ["$total_cost", { $multiply: ["$total_cost", { $divide: [{ $toDouble: "$invest_percentage" }, 100] }] }] },
            {
              $cond: [
                { $and: [{ $eq: ["$invest_flag", true] }, { $or: [{ $eq: ["$invest_percentage", null] }, { $eq: ["$invest_percentage", ""] }] }] },
                0,
                "$total_cost",
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$start_year",
        totalCostSum: { $sum: "$adjustedCost" },
      },
    },
    {
      $sort: { _id: 1 },
      },
  ]);

  let valueFunds = [];
  // console.log("depo 52 >>>> yearsTotalCost", yearsTotalCost, startYear, endYear);

  if (yearsTotalCost.length === 0 || null) {
    valueFunds.push({
      deposition_year: 0,
      curr_value_fund: 0,
      rec_value_fund: 0,
    });
    return valueFunds;
  } else {
    // curr value fund first year

    let curr_value_fund;
    const maintenanceCostStartYear = yearsTotalCost.find(
      (obj) => obj._id == startYear
    );

    curr_value_fund =
      start_value_fund +
      current_deposition -
      (maintenanceCostStartYear?.totalCostSum || 0);
      // console.log("depo >>>> 73","start_value_fund",start_value_fund, "current_deposition", current_deposition, "maintenanceCostStartYear", maintenanceCostStartYear , "maintenanceCostStartYear?.totalCostSum", maintenanceCostStartYear?.totalCostSum, startYear, endYear)

    // recom value fund first year

    let rec_value_fund;
    rec_value_fund =
      start_value_fund +
      rec_deposition -
      (maintenanceCostStartYear?.totalCostSum || 0);
    valueFunds.push({
      deposition_year: startYear,
      curr_value_fund,
      rec_value_fund,
    });
// console.log("depo valueFunds >> 88", valueFunds)
    for (let i = startYear + 1; i <= endYear; i++) {
      const maintenanceCost =
        yearsTotalCost.find((obj) => obj._id === i)?.totalCostSum || 0;
      curr_value_fund =
        valueFunds[valueFunds.length - 1]?.curr_value_fund +
        current_deposition -
        maintenanceCost;
  // console.log("depo  >> 96 valueFundscurr_value_fund",i, valueFunds[valueFunds.length - 1]?.curr_value_fund,"start_value_fund", start_value_fund,"current_deposition", current_deposition, "maintenanceCost", maintenanceCost , "curr_value_fund", curr_value_fund)
      // rec value fund remaining years

      rec_value_fund =
        valueFunds[valueFunds.length - 1]?.rec_value_fund +
        rec_deposition -
        maintenanceCost;

      valueFunds.push({ deposition_year: i, curr_value_fund, rec_value_fund });
    }
    return valueFunds;
  }
};
