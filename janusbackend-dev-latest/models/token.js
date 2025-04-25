import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },

  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  createdAt: { type: Date, default: Date.now, expires: "10m" },
});

export default mongoose.model("Token", tokenSchema);
