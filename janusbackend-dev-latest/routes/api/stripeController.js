import express from "express";
import {
  getAllPrices,
  getCheckoutSession,
  getCustomerInvoices,
  getCustomerPortal,
  getCustomerSubscription,
  webhookCheckout,
  createCustomer,
  createSubscriptionWithoutPayment,
} from "../../utils/stripeService.js";
import User from "../../models/User.js";
const router = express.Router();

router.post("/subscribeWithPromo/:userId/:priceId", async (req, res) => {
  // console.log(
  //   "req.body?.promoCode",
  //   req.body?.promoCode,
  //   "req.params.userId",
  //   req.params.userId
  // );
  try {
    let { promoCode } = req.body;
    let user = await User.findById(req.params.userId);

    if (!user?.customerStripeId) {
      return res.status(400).json({ error: "Customer not found" });
    }

    const subscription = await createSubscriptionWithoutPayment(
      user.customerStripeId,
      req.params.priceId,
      promoCode
    );
    return res.status(200).json(subscription);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

//getCheckoutSession
router.get("/getCheckoutSession/:userId/:priceId", async (req, res) => {
  let { userId, priceId } = req.params;
  try {
    let user = await User.findById(userId);
    if (!user?.customerStripeId) {
      const customer = await createCustomer(user.email);
      user.customerStripeId = customer.id;
      user.save();
    }
    const session = await getCheckoutSession(user?.customerStripeId, priceId);
    return res.status(200).json(session);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//get customer subscription detail
router.get("/getCustomerSubscription/:userId", async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    let subscription = await getCustomerSubscription(user?.customerStripeId);
    return res.status(200).json(subscription);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
//get customer invoices
router.get("/getCustomerInvoices/:userId", async (req, res) => {
  try {
    let invoices = null;
    let user = await User.findById(req.params.userId);
    if (user?.customerStripeId) {
      invoices = await getCustomerInvoices(user?.customerStripeId);
    }
    return res.status(200).json(invoices);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//get customer portal
router.get("/getCustomerPortal/:userId", async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    if (!user?.customerStripeId) {
      // console.log("....user dont have id...");
      const customer = await createCustomer(user.email);
      user.customerStripeId = customer.id;
      user.save();
    }
    let portal = await getCustomerPortal(user?.customerStripeId);
    return res.status(200).json(portal);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/getPrices", async (req, res) => {
  try {
    const prices = await getAllPrices();
    return res.status(200).json(prices);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Export
export default router;
