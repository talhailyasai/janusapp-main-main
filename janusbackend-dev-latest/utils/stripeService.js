import dotenv from "dotenv";
dotenv.config();
import stripe from "stripe";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Building from "../models/Building.js";
import Component from "../models/Component.js";
import uComponents from "../models/uComponents.js";
import MaintainceItems from "../models/MaintainceItems.js";
import Activity from "../models/Activity.js";
import MaintaincePackage from "../models/MaintaincePackage.js";
import MaintenanceReport from "../models/MaintenanceReport.js";
import Planning from "../models/Planning.js";

export const plans = {
  prod_OnAXslApK3GQUp: "Standard Plus",
  prod_OnAS7z7LR5AVQ1: "Standard",
};

//create stripe customer account
const createCustomer = (email, user) => {
  const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

  return stripeInstance.customers.create({
    email,
    name: user?.organization,
    address: {
      line1: user?.address_1,
      line2: user?.address_2,
      country: "se",
      city: user?.city,
      postal_code: user?.zipcode,
    },
    preferred_locales: ["sv"],
  });
};

//getChcekout session
const getCheckoutSession = async (customerStripeId, priceId, type = "new") => {
  const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
  const sessionConfig = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    automatic_tax: {
      enabled: true,
    },
    success_url: `${process.env.FRONT_END_URL}/sign-in`,
    cancel_url: `${process.env.FRONT_END_URL}/pricing-plan`,
    customer: customerStripeId,
  };

  // Only add promotion codes for subscription updates
  if (type === "update") {
    sessionConfig.allow_promotion_codes = true;
  }

  const session = await stripeInstance.checkout.sessions.create(sessionConfig);
  return session;
};

//get customer subscription details
const getCustomerSubscription = async (customerId) => {
  const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
  const subscription = await stripeInstance.subscriptions.list({
    customer: customerId,
    status: "all",
    expand: ["data.default_payment_method"],
  });
  return subscription;
};

// get customer invoices
const getCustomerInvoices = async (customerId) => {
  const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
  console.log("customerId", customerId);
  const invoices = await stripeInstance.invoices.list({
    customer: customerId,
    limit: 10,
    expand: ["data.customer"],
  });
  return invoices;
};

// get customer portal
const getCustomerPortal = async (customerStripeId) => {
  const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
  const portalSession = await stripeInstance.billingPortal.sessions.create({
    customer: customerStripeId,
    return_url: `${process.env.FRONT_END_URL}/useraccounts`,
  });
  return portalSession.url;
};

// Helper function to convert days to milliseconds
const daysToMilliseconds = (days) => {
  return days * 24 * 60 * 60 * 1000;
};

const webhookCheckout = async (req, res) => {
  try {
    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
    const signature = req.headers["stripe-signature"];
    // console.log("103 Stripe Signature:", req.headers["stripe-signature"]);
    // console.log("req.body >>>>>>", req.body);
    const event = stripeInstance.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    // console.log(event, "event");
    let plan = plans[event?.data?.object?.plan?.product];
    let { quantity } = event?.data?.object;
    let currUser = await User.findOne({
      customerStripeId: event.data.object.customer,
    });
    if (event.type === "customer.subscription.created") {
      // console.log(
      //   "118 event.data.object?.trial_end =======",
      //   event.data.object?.trial_end,
      //   "currUser?.trialEnd >>>>>>>.",
      //   currUser?.trialEnd
      // );
      // Check if user already has trial dates
      if (currUser?.trialEnd) {
        // Cancel the trial subscription in Stripe
        try {
          const trialSubscription = await stripeInstance.subscriptions.list({
            customer: event.data.object.customer,
            status: "trialing",
          });
          console.log("129 trialSubscription >>.", trialSubscription);
          if (trialSubscription.data.length > 0) {
            await stripeInstance.subscriptions.cancel(
              trialSubscription.data[0].id,
              {
                invoice_now: true,
                prorate: false,
              }
            );
            console.log(
              `133 Cancelled trial subscription for customer: ${event.data.object.customer}`
            );
          }
        } catch (error) {
          console.error("Error cancelling trial subscription:", error);
        }
      }

      const trialStart = event.data.object?.trial_start
        ? new Date(event.data.object?.trial_start * 1000)
        : undefined;
      const trialEnd = event.data.object?.trial_end
        ? new Date(event.data.object?.trial_end * 1000)
        : undefined;

      // Construct update object dynamically
      let updateData = {
        plan,
        maxUsers: quantity,
        $unset: { cancelSubscriptionDate: "", canceledPlan: "" },
      };

      if (trialStart && !currUser?.trialEnd) {
        // New trial user
        updateData.trialStart = trialStart;
        updateData.trialEnd = trialEnd;
        updateData.maxUsers = 2; // Trial users get 2 max users
      } else if (currUser?.trialEnd) {
        // Existing trial user converting to paid
        updateData.$unset = {
          ...updateData.$unset,
          trialStart: "",
          trialEnd: "",
        };
        // Use the quantity from subscription for paid users
        updateData.maxUsers = quantity;
      }

      await User.findOneAndUpdate(
        { customerStripeId: event.data.object.customer },
        updateData,
        { new: true }
      );
      // console.log("plan", plan);
    } else if (event.type === "customer.subscription.updated") {
      let updatedCustomer = {};
      // console.log(
      //   "194== event.data.object in update  =======",
      //   event.data.object
      // );
      if (event.data.object?.canceled_at !== null) {
        const subscriptionEndDate = new Date(
          event.data.object.current_period_end * 1000
        );
        // Check if this is a real cancellation OR just a trial expiring
        if (
          currUser?.plan !== "Standard Plus" ||
          currUser?.plan !== "Standard" ||
          event.data.object.status !== "active"
        ) {
          // console.log("208 coming in the canceled at un update  =======");
          updatedCustomer.plan = "Under Notice";
          updatedCustomer.canceledPlan = currUser?.plan;
          updatedCustomer.cancelSubscriptionDate = subscriptionEndDate;
        } else {
          console.log("Ignoring trial subscription expiration.");
        }
        updatedCustomer.$unset = {
          trialEnd: "",
          trialStart: "",
        };
      } else {
        // console.log(
        //   "214 coming in the else mode of canceled at un update  =======",
        //   plan
        // );
        updatedCustomer.plan = plan;
        updatedCustomer.maxUsers = quantity;
        updatedCustomer.$unset = {
          cancelSubscriptionDate: "",
          canceledPlan: "",
          trialEnd: "",
          trialStart: "",
        };
      }
      // console.log("updatedCustomer", updatedCustomer);
      await User.findOneAndUpdate(
        { customerStripeId: event.data.object.customer },
        updatedCustomer,
        { new: true }
      );
    } else if (event.type === "customer.subscription.deleted") {
      // console.log(
      //   "194== event.data.object in delete  =======",
      //   event.data.object
      // );
      // Check if this is a trial cancellation - if so, ignore it
      if (
        event.data.object.status === "trialing" ||
        event.data.object.trial_end !== null
      ) {
        console.log("Ignoring trial subscription cancellation");
        return res.status(200).json({ received: true });
      }
      console.log("***coming after trial subscription cancellation***");
      // const subscriptionEndDate = new Date(
      //   event.data.object.current_period_end * 1000
      // );
      const subscriptionEndDate = new Date(
        event.data.object.current_period_end * 1000
      );
      await User.findOneAndUpdate(
        { customerStripeId: event.data.object.customer },
        {
          plan: "Under Notice",
          cancelSubscriptionDate: subscriptionEndDate,
          canceledPlan: currUser?.plan,
        },
        { new: true }
      );
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
};

// get all prices
const getAllPrices = async (req, res) => {
  const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
  const prices = await stripeInstance.prices.list({
    limit: 20,
    active: true,
  });
  return prices;
};

const createSubscriptionWithoutPayment = async (
  customerStripeId,
  priceId,
  promoCode
) => {
  const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

  // Retrieve promotion code details from Stripe
  const promoCodes = await stripeInstance.promotionCodes.list({
    code: promoCode,
    active: true,
  });
  console.log("promoCodes >>", promoCodes);
  if (promoCodes.data.length === 0) {
    return { message: "Invalid promo code", status: 400 };
  }

  // Create a subscription for the user with the discount
  const subscription = await stripeInstance.subscriptions.create({
    customer: customerStripeId,
    items: [{ price: priceId }],
    discounts: [
      {
        promotion_code: promoCodes.data[0].id, // Apply promo code
      },
    ],
    trial_period_days: 10, // Give 30 days free access
  });

  return subscription;
};

export {
  createCustomer,
  getAllPrices,
  getCheckoutSession,
  getCustomerSubscription,
  getCustomerInvoices,
  getCustomerPortal,
  webhookCheckout,
  createSubscriptionWithoutPayment,
};
