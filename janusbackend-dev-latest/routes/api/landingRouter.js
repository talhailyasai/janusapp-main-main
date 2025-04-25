// Imports
import express from "express";

const router = express.Router();
import { sendUserDetail } from "../../utils/emails.js";
router.post("/", async (req, res) => {
  try {
    await sendUserDetail(req.body, res);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Export
export default router;
