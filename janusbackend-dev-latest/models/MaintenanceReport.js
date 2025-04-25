// Imports
import mongoose from "mongoose";

// Schema
const reportSchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  value: { type: String },
  image: { type: String },
});

// Export
export default mongoose.model("Maintenance-Report", reportSchema);
