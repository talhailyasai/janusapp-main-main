// Imports
import express from "express";
import User from "../../models/User.js";
const router = express.Router();
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import bcrypt from "bcryptjs";
import Token from "../../models/token.js";
import { createCustomer } from "../../utils/stripeService.js";
import {
  sendEmailToVerifyAccount,
  sendForgotPasswordMail,
  sendLoginAttemptAlert,
} from "../../utils/emails.js";
import stripe from "stripe";

const signToken = (id, user) => {
  // console.log("user", user);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createJwtToken = async (user, statusCode, res, isVerified) => {
  const token = signToken(user._id, user);

  // Save token to user document
  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        token: token,
        isLogin: true,
        loginTime: new Date(),
        ...(isVerified && { isVerified: true }),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  user.password = undefined;
  return res.status(statusCode).json({
    message: "Login Sucessfully",
    token,
    data: {
      user,
    },
  });
};

// Signup code
router.post("/signup", async (req, res) => {
  try {
    if (!req?.body?.password || !req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Please provide Email and Password",
      });
    }
    const isUserFound = await User.find({ email: req.body.email });
    if (isUserFound.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(req?.body?.password, 12);
      req.body.password = hashedPassword;
      if (req.body.role != "user" || !req.body.role) {
        const customer = await createCustomer(req.body.email, req.body);
        req.body.customerStripeId = customer.id;
      }
      if (req.body.role === "user") {
        let admin = await User.findById(req.body?.tenantId);
        let addedUsers = await User.find({ tenantId: req.body?.tenantId });
        if (addedUsers?.length + 1 >= (admin?.maxUsers || 0)) {
          return res.status(400).json({
            maxUser: true,
            message: admin?.maxUsers || 0,
          });
        }
      }
      let user = await User.create(req.body);

      if (req.body.role === "user") return res.status(201).send(user);
      let token = user.generateVerificationToken();
      await token.save();
      await sendEmailToVerifyAccount(user, token?.token, res);
      // res.status(201).json({ message: "User Created Sucessfully", user });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Signin code
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(200)
        .json({ message: "Please provide Email or Password", error: true });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(200)
        .json({ message: "Invalid email or password", error: true });
    }
    // console.log("passwrod coming >>> ", password, user.password);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(200)
        .json({ message: "Invalid email or password", error: true });
    }

    // Check if user is already logged in
    if (user?.isLogin) {
      await sendLoginAttemptAlert(user);
      return res.status(200).json({
        message: {
          en: "This account is already active in another session. You cannot login.",
          sv: "Detta konto används redan i en annan aktiv session. Du kan inte logga in.",
        },
        error: true,
      });
    }

    if (user && !user?.isVerified) {
      let token = user.generateVerificationToken();
      await token.save();
      await sendEmailToVerifyAccount(user, token?.token, res, true);

      return res
        ?.status(200)
        .json({ message: "Email not verified", verified: false });
    }

    createJwtToken(user, 200, res);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.post("/mailVerification", async (req, res) => {
  if (!req.body.token)
    return res.status(400).json({
      message: "token is not provided",
    });
  try {
    const token = await Token.findOne({ token: req.body.token });
    if (!token) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }
    const user = await User.findById(token.userId);
    if (!user) {
      return res.status(400).json({
        message: "no user for this token",
      });
    }
    if (token?.email) {
      user.email = token.email;
      await user.save();
      // Update customer email in Stripe
      try {
        const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
        await stripeInstance.customers.update(user.customerStripeId, {
          email: token.email,
        });
      } catch (stripeErr) {
        console.log("Stripe email update error:", stripeErr);
      }
      await Token.findOneAndDelete({ findOneAndDelete: req.body.token });

      return res.status(201).json({
        success: true,
        message: "Email updated is successfully!",
        user,
      });
    }
    if (user.isVerified) {
      return res.status(400).json({
        // message: " Ez a felhasználó már korábban igazolva volt",
        message: " user has already been verified",
      });
    }
    // If req.body.isVerified is true, update the user's isVerified property
    if (req.body.isVerified) {
      user.isVerified = true;
      await user.save();
    }
    if (!req.body.login) {
      return res.status(201).json({
        success: true,
        message: "Account is successfully verified",
        user,
      });
    } else {
      createJwtToken(user, 200, res, true);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      // const url = `${process.env.FRONT_END_URL}/resetPassword/${user._id}`;
      let token = user.generateVerificationToken();
      await token.save();
      await sendForgotPasswordMail(email, token?.token, res);
    } else {
      return res.status(400).json({ message: "Email does not exist" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/resetPassword", async (req, res) => {
  try {
    const { password, token } = req.body;
    const result = await Token.findOne({ token });

    if (!result) {
      return res.status(400).json({
        message: "Invalid or Expired Link",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Update password and logout user
    let data = await User.findByIdAndUpdate(
      result?.userId,
      {
        password: passwordHash,
        isLogin: false, // Log out the user
        loginTime: null, // Reset login time
        token: null,
      },
      { new: true }
    );

    if (data) {
      // res.status(200).json({ message: "Password reset Successfully" });
      return res.status(200).json({ message: "Password reset Successfully" });
    } else {
      return res.status(400).json({ message: "unable to find user" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/generate-token", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    const token = signToken(user._id, user);
    return res.status(201).json(token);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

// Add new logout route
router.post("/logout", async (req, res) => {
  try {
    const { id } = req.body;
    const authHeader = req.headers.authorization;
    const incomingToken = authHeader?.split(" ")[1];

    if (!id) {
      return res.status(400).json({
        message: {
          en: "id is required",
          sv: "id krävs",
        },
      });
    }

    // First find the user to check their token
    const existingUser = await User.findOne({ _id: id });

    if (!existingUser) {
      return res.status(404).json({
        message: {
          en: "User not found",
          sv: "Användaren hittades inte",
        },
      });
    }

    // If tokens don't match, return success without logging out
    if (existingUser.token !== incomingToken) {
      return res.status(200).json({
        message: {
          en: "Logged out successfully",
          sv: "Utloggad framgångsrikt",
        },
      });
    }

    // If tokens match, proceed with logout
    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        isLogin: false,
        token: null, // Clear the token
        loginTime: null,
      },
      { new: true }
    );

    return res.status(200).json({
      message: {
        en: "Logged out successfully",
        sv: "Utloggad framgångsrikt",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: {
        en: "Error logging out",
        sv: "Fel vid utloggning",
      },
    });
  }
});

export default router;
