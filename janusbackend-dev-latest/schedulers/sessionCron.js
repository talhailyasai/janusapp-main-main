import cron from "node-cron";
import User from "../models/User.js";

const checkAndLogoutExpiredSessions = async () => {
  try {
    const expirationTime = parseInt(process.env.JWT_EXPIRES_IN) || 30;
    const currentTime = new Date();

    // Find all logged in users
    const loggedInUsers = await User.find({
      isLogin: true,
      loginTime: { $ne: null },
    });

    // Check each user's session duration
    for (const user of loggedInUsers) {
      const loginDuration = Math.floor(
        (currentTime - user.loginTime) / (60 * 1000)
      ); // Convert to minutes

      if (loginDuration >= expirationTime) {
        await User.findByIdAndUpdate(
          user._id,
          {
            $set: {
              isLogin: false,
              loginTime: null,
              token: null,
            },
          },
          {
            strict: true,
            new: false,
            runValidators: true,
          }
        );
      }
    }

    console.log(
      `Session cleanup completed: checked ${loggedInUsers.length} active sessions`
    );
  } catch (error) {
    console.error("Session cleanup error:", error);
  }
};

// Run every 5 minutes
const initSessionCleanup = () => {
  cron.schedule("*/5 * * * *", () => {
    checkAndLogoutExpiredSessions();
  });
  console.log("Session cleanup cron job initialized");
};

export default initSessionCleanup;
