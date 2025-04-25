// Imports
import mongoose from "mongoose";

// Schema
const MaintaincePackageSchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  maintenance_package: { type: String },
  packageDescription: { type: String },
  MaintenanceItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "maintenance_items",
      required: false,
    },
  ],
});

// Export
export default mongoose.model(
  "maintenance_package",
  MaintaincePackageSchema,
  "maintenance_package"
);
