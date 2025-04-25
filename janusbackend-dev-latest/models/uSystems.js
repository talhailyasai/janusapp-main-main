// Imports
import mongoose from "mongoose";

// Schema
const USystemsSchema = mongoose.Schema({
  system_code: { type: String },
  system_name: { type: String },
});

// Export
export default mongoose.model("u_system", USystemsSchema, "u_system");
