// Imports
import cloudinary from "cloudinary";

// Configuration
const cloudinaryV = cloudinary.v2;
cloudinaryV.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export
export default cloudinaryV;
