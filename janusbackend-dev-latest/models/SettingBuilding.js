// Imports
import mongoose from "mongoose";

// Schema
const settingBuildingSchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  facade: [
    {
      name: String,
    },
  ],
  windows: [
    {
      name: String,
    },
  ],
  doors: [
    {
      name: String,
    },
  ],

  heatDistribution: [
    {
      name: String,
    },
  ],
  ventilation: [
    {
      name: String,
    },
  ],
  roof: [
    {
      name: String,
    },
  ],
  foundation: [
    {
      name: String,
    },
  ],
  electricity: [
    {
      name: String,
    },
  ],
  heating: [
    {
      name: String,
    },
  ],
});

// Export
export default mongoose.model("settingBuilding", settingBuildingSchema);
