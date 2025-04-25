// Imports
import mongoose from "mongoose";

// Schema
const settingRentalSchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  objectId: Number,
  objectType: String,
  apartmentNo: Number,
  floor: Number,
  rent: Number,
  contractArea: Number,
  property: Number,
  building: Number,
  address: String,
});

// Export
export default mongoose.model("rental_object", settingRentalSchema);
