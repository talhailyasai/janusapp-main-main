import mongoose from "mongoose";

const u_buildings_schema = mongoose.Schema({
  attribute_type: {
    type: String,
  },
  value: [
    {
      type: String,
    },
  ],
});

export default mongoose.model("u_buildings", u_buildings_schema);
