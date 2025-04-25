// Imports
import express from "express";
const router = express.Router();
import User from "../../models/User.js";

router.patch("/:id", async (req, res) => {
  try {
    const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(201).json(doc);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.patch("/functions/:id", async (req, res) => {
  try {
    let query;
    let userFunctionName = req.body.functionName;

    if (req.body.switchOn) {
      query = { $push: { Functions: userFunctionName } };
    } else {
      query = { $pull: { Functions: userFunctionName } };
    }

    let data = await User.findByIdAndUpdate(req.params.id, query, {
      new: true,
    });

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Export
export default router;
