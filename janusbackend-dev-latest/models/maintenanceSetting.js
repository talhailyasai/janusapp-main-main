// Imports
import mongoose from "mongoose";

// Schema
const MaintainceSettingSchema = mongoose.Schema({
  version_name: { type: String },
  plan_start_year: { type: Number },
  plan_duration: { type: Number },
  general_surcharge: { type: Number },
  vat_percent: { type: Number },
  use_index: { type: Boolean },
  yearly_increase: { type: Number },
  base_year_increase: { type: Number },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

// Export
export default mongoose.model("maintenance_setting", MaintainceSettingSchema);
