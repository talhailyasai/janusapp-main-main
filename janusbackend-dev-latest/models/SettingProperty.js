// Imports
import mongoose from "mongoose";

// Schema
const settingPropertySchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  administrativeArea: [
    {
      name: String,
    },
  ],
  operationsArea: [
    {
      name: String,
    },
  ],
  useType: [
    {
      name: String,
    },
  ],
});

// Export
export default mongoose.model("settingProperty", settingPropertySchema);
