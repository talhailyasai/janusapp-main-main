// All Imports
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import routes from "./routes/index.js";
import { webhookCheckout } from "./utils/stripeService.js";
import { getSecrets } from "./utils/secrets.js";
import initSessionCleanup from "./schedulers/sessionCron.js";
import initSubscriptionCleanup from "./schedulers/subscriptionCron.js";

// Middleware
dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use("/webhook", express.raw({ type: "application/json" }), webhookCheckout);

// app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use(routes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Janus Api" });
});

(async () => {
  try {
    // await getSecrets(); // Load secrets from AWS Secrets Manager
    console.log("Secrets loaded successfully");

    // Database Connect
    mongoose
      .connect(process.env.MONGO_DB)
      .then(() => {
        console.log("Connected to the database");
        // Initialize the cron job after DB connection is established
        initSessionCleanup();
        initSubscriptionCleanup();
      })
      .catch((err) => console.log(err));

    // Server Port
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to load secrets:", error);
    process.exit(1); // Exit the app if secrets cannot be loaded
  }
})();
