// Imports
import express from "express";
const router = express.Router();
import cloudinaryV from "../../utils/cloudinary.js";
import axios from "axios";

// Uploading image
router.post("/", async (req, res) => {
  try {
    const fileStr = req.body.data;
    const img = await cloudinaryV.uploader.upload(fileStr, {
      upload_preset: "janus_attendance",
      public_id: req.body.id,
    });
    return res.status(201).json(img);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching images
router.get("/", async (req, res) => {
  try {
    const images = await cloudinaryV.search
      .expression("folder:janus_images")
      .sort_by("public_id", "desc")
      .max_results(100)
      .execute();
    return res.status(200).json(images);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/proxy-image", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    // console.log(imageUrl);
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    res.setHeader("Content-Type", "image/png");
    return res.send(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error fetching image");
  }
});

// Export
export default router;
