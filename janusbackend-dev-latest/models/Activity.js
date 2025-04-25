// Imports
import mongoose from "mongoose";

// Schema
const ActivitySchema = mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "properties",
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "buildings",
  },
  component: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "components",
  },
  date: { type: String },
  user: { type: String },
  description: { type: String },
  activity: { type: String },
  work_order: { type: String },
  time: { type: String },
  remark: { type: String },
  longitude: { type: String },
  latitude: { type: String },

  unique_index_component: { type: String },
  changed_by: { type: String },
  changed_date: { type: String },
  img: { type: String },
  // ......................
  article_number: { type: String },
  quantity: { type: String },
  time_minutes: { type: String },
  material_coast: { type: String },
  image: {
    link: { type: String },
    createdAt: { type: Date, default: new Date() },
    format: { type: String },
    dimensions: { type: String },
    key: { type: String },
  },
});

// Export
export default mongoose.model("activities", ActivitySchema);
