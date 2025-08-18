import "dotenv/config.js";
import { connectDB } from "./db.js";
import { Notification } from "./modals/Notification.js";

(async () => {
  try {
    await connectDB();
    await Notification.deleteMany({});
    await Notification.insertMany([
      {
        title: "Welcome!",
        message: "Thanks for installing the app.",
        type: "system",
        isRead: false
      },
      {
        title: "Profile incomplete",
        message: "Tap to complete your profile (multi-step form).",
        type: "form",
        isRead: false,
        payload: { wizard: true }
      },
      {
        title: "Flash Sale",
        message: "50% off for 2 hours only!",
        type: "promo",
        isRead: true
      }
    ]);
    console.log("✅ Seeded notifications");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
