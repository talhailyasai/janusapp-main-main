// Imports
import mongoose from "mongoose";

// Schema
const MaintainceDepositionsSchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  current_deposition: { type: Number },
  recommended_deposition: { type: Number },
  start_value_fund: { type: Number },
  average_yearly_maintenance_costs: { type: Number },
  depositions: [
    {
      deposition_year: { type: Number },
      curr_value_fund: { type: Number },
      rec_value_fund: { type: Number },
    },
  ],
  end_value_fund: { type: Number },
  end_value_fund_recommended: { type: Number },
  current_deposition_boa: { type: Number },
  recommended_deposition_boa: { type: Number },
});

// Export
export default mongoose.model(
  "maintenance_depositions",
  MaintainceDepositionsSchema
);
