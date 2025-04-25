// Imports
import mongoose from "mongoose";

// Schema
const settingAddressesSchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  address: String,
  zipCode: Number,
  postalAddress: String,
  building: Number,
  property: Number,
});

// Export
export default mongoose.model("settingAddresse", settingAddressesSchema);
