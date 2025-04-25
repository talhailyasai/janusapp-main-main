// Imports
import mongoose from "mongoose";

// Schema
const MaintainceItemsSchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  article: { type: String },
  maintenance_activity: { type: String },
  technical_life: { type: String },
  u_system: { type: String },
  text: { type: String },
  unit: { type: String },
  price_per_unit: { type: String },
  default_amount: { type: String },
  source: { type: String },
  order: {
    type: Number,
  },
});

// Export
export default mongoose.model(
  "maintenance_items",
  MaintainceItemsSchema,
  "maintenance_items"
);
