// Imports
import mongoose from "mongoose";

// Schema
const UComponentSchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  u_component_abbreviation: { type: String },
  u_component_name: { type: String },
  u_system: { type: String },
  technical_life: { type: Number },
  other_interval_value: { type: String },
  other_interval_unit: { type: String },
  attendance_interval_value: { type: String },
  attendance_interval_unit: { type: String },
  maintenance_interval_value: { type: String },
  maintenance_interval_unit: { type: String },
  attendance_budget_time: { type: Number },
  cleaning_budget_time: { type: Number },
  maintenance_budget_time: { type: Number },
  attendance_text: { type: String },
  maintenance_text: { type: String },
  cleaning_text: { type: String },
  attribute_1: { type: String },
  attribute_2: { type: String },
  attribute_3: { type: String },
  attribute_4: { type: String },
  attribute_5: { type: String },
  attribute_6: { type: String },
  order: {
    type: Number,
  },
});

// Export
export default mongoose.model("u_component", UComponentSchema, "u_component");
