// Imports
import mongoose from "mongoose";

// Schema
const componentPackageSchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  component_package: { type: String },
  packageDescription: { type: String },
  Components: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "u_component",
      required: false,
    },
  ],
});

// Export
export default mongoose.model(
  "ComponentPackage",
  componentPackageSchema,
  "component_package"
);
