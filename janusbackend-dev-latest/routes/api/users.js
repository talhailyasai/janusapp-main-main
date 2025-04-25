// Imports
import express from "express";
import User from "../../models/User.js";
import { multerUploadS3 } from "../../utils/s3Helper.js";
import bcrypt from "bcryptjs";
import { sendEmailToVerifyAccount } from "../../utils/emails.js";
import token from "../../models/token.js";
import randomstring from "randomstring";
import mongoose from "mongoose";
import Property from "../../models/Property.js";
import Building from "../../models/Building.js";
import Component from "../../models/Component.js";
import Activity from "../../models/Activity.js";
import Planning from "../../models/Planning.js";
import MaintainceItems from "../../models/MaintainceItems.js";
import MaintaincePackage from "../../models/MaintaincePackage.js";
import maintenanceDepositions from "../../models/maintenanceDepositions.js";
import MaintenanceReport from "../../models/MaintenanceReport.js";
import maintenanceSetting from "../../models/maintenanceSetting.js";
import SettingAddresses from "../../models/SettingAddresses.js";
import SettingBuilding from "../../models/SettingBuilding.js";
import SettingProperty from "../../models/SettingProperty.js";
import SettingRental from "../../models/SettingRental.js";
import uComponents from "../../models/uComponents.js";
import componentPackage from "../../models/componentPackage.js";
import stripe from "stripe";

const router = express.Router();

// Fetching user
router.get("/", async (req, res) => {
  try {
    let tenantId = req?.user?._id?.toString();

    const user = await User.find({
      $or: [{ tenantId: tenantId }, { tenantId: { $exists: false } }],
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("tenantId");
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.patch("/:id", multerUploadS3.any(), async (req, res) => {
  try {
    if (req.files?.length > 0) {
      // console.log("req.files[0]?.location", req.files[0]);
      req.body.photo = req.files[0]?.location;
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Fetching user  by admin id
router.get("/adminId/:id", async (req, res) => {
  try {
    let user;
    if (req.user.role === "user") {
      user = await User.find({ tenantId: req.user.tenantId });
    } else {
      const condition = req.query.admin
        ? { $or: [{ tenantId: req.params.id }, { _id: req.params.id }] }
        : { tenantId: req.params.id };

      user = await User.find(condition);
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Fetching user  by admin id
router.patch("/edit/:id", async (req, res) => {
  try {
    let foundUser = await User.findOne({
      _id: req.params.id,
    });
    if (!foundUser) {
      return res.status(400).json({ message: "User does not exist!" });
    }
    if (req.body.passwordChange) {
      const passwordHash = await bcrypt.hash(req.body.password, 12);
      req.body.password = passwordHash;
    }
    if (req.body.email) {
      if (
        foundUser &&
        foundUser?.email !== req.body.email &&
        foundUser?.role !== "user"
      ) {
        const newToken = await new token({
          userId: req.params.id,
          token: randomstring.generate({
            length: 6,
            charset: "numeric",
          }),
          email: req.body.email,
        });
        await newToken.save();
        foundUser.email = req.body.email;
        await sendEmailToVerifyAccount(foundUser, newToken?.token, res, true);
        return res
          .status(201)
          .json({ message: "Check your email for verification code" });
      } else {
        const updateUser = await User.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );
        return res.status(200).json(updateUser);
      }
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updateUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Delete user  by  id
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const deleteUser = await User.findByIdAndDelete(req.params.id);
//   return  res.status(200).json(deleteUser);
//   } catch (err) {
//   return  res.status(500).json(err);
//   }
// });

router.delete("/delete/:id", async (req, res) => {
  req.setTimeout(0); //  Disable request timeout (API won't time out)
  const session = await mongoose.startSession(); // Start session
  const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const userId = req.params.id;
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("foundUser", foundUser);

    const tenantId =
      foundUser.role === "user"
        ? foundUser?.tenantId?.toString()
        : foundUser?._id?.toString();

    session.startTransaction(); // Start transaction

    let userDelete = { deletedCount: 0 },
      propertyDelete = { deletedCount: 0 },
      buildingDelete = { deletedCount: 0 },
      planningDelete = { deletedCount: 0 },
      componentDelete = { deletedCount: 0 },
      activityDelete = { deletedCount: 0 };

    if (foundUser.role === "user") {
      //  Update Properties, Buildings, and Components sequentially
      await Property.updateMany(
        {
          $and: [
            { tenantId },
            {
              responsible_user: {
                $regex: new RegExp("^" + foundUser.email, "i"),
              },
            },
          ],
        },
        { $set: { responsible_user: "" } },
        { session }
      );

      await Building.updateMany(
        {
          $and: [
            { tenantId },
            {
              responsible_user: {
                $regex: new RegExp("^" + foundUser.email, "i"),
              },
            },
          ],
        },
        { $set: { responsible_user: "" } },
        { session }
      );

      await Component.updateMany(
        {
          $and: [
            { tenantId },
            {
              responsible_user: {
                $regex: new RegExp("^" + foundUser.email, "i"),
              },
            },
          ],
        },
        { $set: { responsible_user: "" } },
        { session }
      );

      //  Delete User sequentially
      userDelete = await User.deleteOne(
        { _id: foundUser?._id.toString() },
        { session }
      );
    } else {
      if (foundUser?.trialEnd) {
        try {
          // First check if customerStripeId exists
          if (foundUser.customerStripeId) {
            // Delete Stripe customer
            await stripeInstance.customers.del(foundUser.customerStripeId);

            console.log(
              `Deleted Stripe Customer: ${foundUser.customerStripeId}`
            );
          }
        } catch (stripeError) {
          console.error("Failed to delete Stripe customer:", {
            customerId: foundUser.customerStripeId,
            error: stripeError.message,
          });
        }
      }
      //  Delete user and all related data sequentially
      userDelete = await User.deleteMany(
        { $or: [{ _id: tenantId }, { tenantId }] },
        { session }
      );

      propertyDelete = await Property.deleteMany({ tenantId }, { session });
      buildingDelete = await Building.deleteMany({ tenantId }, { session });
      componentDelete = await Component.deleteMany({ tenantId }, { session });
      planningDelete = await Planning.deleteMany({ tenantId }, { session });
      activityDelete = await Activity.deleteMany({ tenantId }, { session });

      await MaintainceItems.deleteMany({ tenantId }, { session });
      await MaintaincePackage.deleteMany({ tenantId }, { session });
      await maintenanceDepositions.deleteMany({ tenantId }, { session });
      await MaintenanceReport.deleteMany({ tenantId }, { session });
      await maintenanceSetting.deleteMany({ tenantId }, { session });
      await SettingAddresses.deleteMany({ tenantId }, { session });
      await SettingBuilding.deleteMany({ tenantId }, { session });
      await SettingProperty.deleteMany({ tenantId }, { session });
      await SettingRental.deleteMany({ tenantId }, { session });
      await uComponents.deleteMany({ tenantId }, { session });
      await componentPackage.deleteMany({ tenantId }, { session });
    }

    await session.commitTransaction(); //  Commit Transaction
    session.endSession(); //  End session

    return res.status(200).json({
      message: "User and all associated data deleted successfully",
      deletedCounts: {
        users: userDelete.deletedCount,
        properties: propertyDelete.deletedCount,
        buildings: buildingDelete.deletedCount,
        components: componentDelete.deletedCount,
        activities: activityDelete.deletedCount,
      },
    });
  } catch (err) {
    await session.abortTransaction(); //  Rollback on error
    session.endSession(); //  End session in error case

    console.error("Error deleting user:", err);
    return res.status(500).json({
      message: "Error deleting user",
      error: err.message,
    });
  }
});

// Fetching   Responsible user
router.get("/responsibleUser/:id", async (req, res) => {
  try {
    const user = await User.find({
      tenantId: req.params.id,
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Export
export default router;
