import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, default: "" },
    type: {
      type: String,
      enum: ["default", "form", "promo", "system"],
      default: "default"
    },
    isRead: { type: Boolean, default: false },
    // Optional: per-user targeting
    userId: { type: String, default: null },
    // Optional: arbitrary payload for deep actions
    payload: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

// Useful indexes
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ isRead: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", NotificationSchema);
