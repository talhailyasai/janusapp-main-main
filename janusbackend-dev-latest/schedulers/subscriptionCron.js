import cron from "node-cron";
import mongoose from "mongoose";
import moment from "moment-timezone";
import User from "../models/User.js";
import Building from "../models/Building.js";
import Component from "../models/Component.js";
import Activity from "../models/Activity.js";
import Property from "../models/Property.js";
import Planning from "../models/Planning.js";
import stripe from "stripe";

import MaintainceItems from "../models/MaintainceItems.js";
import maintenanceDepositions from "../models/maintenanceDepositions.js";
import MaintenanceReport from "../models/MaintenanceReport.js";
import maintenanceSetting from "../models/maintenanceSetting.js";
import SettingAddresses from "../models/SettingAddresses.js";
import SettingBuilding from "../models/SettingBuilding.js";
import SettingProperty from "../models/SettingProperty.js";
import SettingRental from "../models/SettingRental.js";
import uComponents from "../models/uComponents.js";
import componentPackage from "../models/componentPackage.js";
import MaintaincePackage from "../models/MaintaincePackage.js";

const deleteExpiredSubscriptions = async () => {
  const session = await mongoose.startSession();
  const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

  try {
    // Get Sweden's date at midnight (00:00:00)
    const today = moment.tz("Europe/Stockholm").startOf("day").toDate();
    const tomorrow = moment(today).add(1, "day").toDate();

    console.log(
      `Sweden Date: ${today.toISOString()}, Tomorrow: ${tomorrow.toISOString()}`
    );

    // Find users whose subscription ends today in Sweden's timezone
    const expiredUsers = await User.find({
      $or: [
        {
          cancelSubscriptionDate: {
            $exists: true,
            $ne: null,
            $gte: today,
            $lt: tomorrow,
          },
        },
        {
          trialEnd: {
            $exists: true,
            $ne: null,
            $gte: today,
            $lt: tomorrow,
          },
        },
      ],
    }).maxTimeMS(0);

    console.log(
      `Found ${expiredUsers?.length} expired subscriptions to process`
    );
    if (expiredUsers?.length > 0) {
      for (const user of expiredUsers) {
        await session.withTransaction(async () => {
          const tenantId = user._id.toString();
          // Set no timeout for deletion operations
          const options = { session, maxTimeMS: 0 };

          try {
            // 🔹 Delete Stripe customer first
            await stripeInstance.customers.del(user?.customerStripeId);
            console.log(`Deleted Stripe Customer: ${user?.customerStripeId}`);
          } catch (stripeError) {
            console.error(
              `Failed to delete Stripe customer: ${stripeError.message}`
            );
          }

          // Delete user and all associated data in a single transaction
          await User.deleteMany(
            { $or: [{ _id: tenantId }, { tenantId }] },
            options
          );
          await Property.deleteMany({ tenantId }, options);
          await Building.deleteMany({ tenantId }, options);
          await Component.deleteMany({ tenantId }, options);
          await Planning.deleteMany({ tenantId }, options);
          await Activity.deleteMany({ tenantId }, options);

          await MaintainceItems.deleteMany({ tenantId }, options);
          await MaintaincePackage.deleteMany({ tenantId }, options);
          await maintenanceDepositions.deleteMany({ tenantId }, options);
          await MaintenanceReport.deleteMany({ tenantId }, options);
          await maintenanceSetting.deleteMany({ tenantId }, options);
          await SettingAddresses.deleteMany({ tenantId }, options);
          await SettingBuilding.deleteMany({ tenantId }, options);
          await SettingProperty.deleteMany({ tenantId }, options);
          await SettingRental.deleteMany({ tenantId }, options);
          await uComponents.deleteMany({ tenantId }, options);
          await componentPackage.deleteMany({ tenantId }, options);
        });
      }

      console.log(
        `Successfully processed ${expiredUsers.length} expired subscriptions`
      );
    }
  } catch (error) {
    console.error("Subscription cleanup error:", error);
  } finally {
    await session.endSession();
  }
};

// Schedule the job to run every day at 00:05 Sweden time
const initSubscriptionCleanup = () => {
  cron.schedule("5 0 * * *", deleteExpiredSubscriptions, {
    scheduled: true,
    timezone: "Europe/Stockholm",
  });

  console.log(
    "Subscription cleanup cron job initialized to run every day at 00:05 Sweden time."
  );
};

export default initSubscriptionCleanup;
