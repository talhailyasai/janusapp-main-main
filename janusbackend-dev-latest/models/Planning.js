// Imports
import mongoose from "mongoose";

// Schema
const PlanningSchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  article: { type: String },
  maintenance_activity: { type: String },
  technical_life: { type: Number },
  u_system: { type: String },
  quantity: { type: Number },
  unit: { type: String },
  price_per_unit: { type: Number },
  total_cost: { type: Number, default: 0 },
  start_year: { type: Number },
  previous_year: { type: Number },
  building_code: { type: Number },
  property_code: { type: Number },
  changed_by: { type: String },
  price_intervall: { type: String },
  priority: { type: String },
  source: { type: String },
  risk_flag: { type: Boolean },
  invest_flag: { type: Boolean },
  inspection_flag: { type: Boolean },
  energy_flag: { type: Boolean },
  project_flag: { type: Boolean },
  invest_percentage: { type: String },
  energy_save_percentage: { type: String },
  work_order_no: { type: String },
  building_code: { type: String },
  property_code: { type: String },
  changed_by: { type: String },
  change_date: { type: String },
  text: { type: String },
  position: { type: String },
  status: { type: String, default: "Planerad" },
  real_cost: { type: Number },
  files: [
    {
      image: { type: String },
      name: { type: String },
      createdAt: { type: Date, default: new Date() },
      format: { type: String },
      dimensions: { type: String },
      key: { type: String },
    },
  ],
});

// Export
export default mongoose.model("planning", PlanningSchema, "maintenance_plan");
