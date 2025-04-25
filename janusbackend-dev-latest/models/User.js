// Imports
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import randomstring from "randomstring";
import Token from "./token.js";
// Schema
const UserSchema = mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    isFirstLogin: {
      type: Boolean,
      default: false,
    },
    isLogin: { type: Boolean },
    loginTime: {
      type: Date,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    Functions: { type: Array },
    user: { type: String },
    city: { type: String },
    zipcode: { type: String },
    password: { type: String, required: true },
    name: { type: String },
    operations_area: { type: Number },
    cost_center: { type: Number },
    mobile_phone: { type: String },
    email: { type: String, set: (value) => value?.toLowerCase() },
    inactive: { type: String },
    changed_by: { type: String },
    photo: { type: String },
    role: { type: String },
    organization: { type: String },
    address_1: { type: String },
    address_2: { type: String },
    propertyAccess: { type: String },
    accessRepubItem: {
      type: Boolean,
      default: false,
    },
    changed_date: { type: Date },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAccessAllProperty: {
      type: Boolean,
      default: true,
    },
    customerStripeId: { type: String },
    plan: { type: String, default: "Under Notice" },
    maxUsers: Number,
    disable: {
      type: Boolean,
      default: false,
    },
    cancelSubscriptionDate: {
      type: Date,
    },
    trialStart: {
      type: Date,
      required: false,
    },
    trialEnd: {
      type: Date,
      required: false,
    },
    canceledPlan: { type: String },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

UserSchema.methods.generateVerificationToken = function () {
  let payload = {
    userId: this._id,
    token: randomstring.generate({
      length: 6,
      charset: "numeric",
    }),
  };

  // console.log(payload);

  return new Token(payload);
};

export default mongoose.model("users", UserSchema);
