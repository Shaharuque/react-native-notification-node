import express from "express";
import { Notification } from "../modals/Notification.js";

export default function buildNotificationRouter(io) {
  const router = express.Router();

  // GET /notifications?status=all|read|unread&userId=<id>&page=1&limit=20
  router.get("/", async (req, res) => {
    const {
      status = "all",
      userId = null,
      page = 1,
      limit = 20
    } = req.query;

    const q = {};
    if (userId) q.userId = userId;
    if (status === "read") q.isRead = true;
    if (status === "unread") q.isRead = false;

    const p = Math.max(parseInt(page, 10) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const [items, total] = await Promise.all([
      Notification.find(q).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
      Notification.countDocuments(q)
    ]);

    res.json({
      data: items,
      pagination: {
        page: p,
        limit: l,
        total,
        totalPages: Math.ceil(total / l)
      }
    });
  });

  // POST /notifications
  router.post("/", async (req, res) => {
    const { title, message = "", type = "default", userId = null, payload = {} } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title is required" });
    }

    const created = await Notification.create({ title, message, type, userId, payload });
    // Broadcast: if userId present, emit to that room; otherwise global
    if (userId) {
      io.to(`user:${userId}`).emit("new-notification", created);
    } else {
      io.emit("new-notification", created);
    }

    res.status(201).json(created);
  });

  // PATCH /notifications/:id/read  (body: { isRead?: boolean })
  router.patch("/:id/read", async (req, res) => {
    const { id } = req.params;
    const { isRead = true } = req.body;

    const updated = await Notification.findByIdAndUpdate(
      id,
      { $set: { isRead: !!isRead } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });

    // Notify clients about read status change
    const room = updated.userId ? `user:${updated.userId}` : null;
    if (room) io.to(room).emit("notification-read", { id: updated.id, isRead: updated.isRead });
    else io.emit("notification-read", { id: updated.id, isRead: updated.isRead });

    res.json(updated);
  });

  // PATCH /notifications/mark-all-read?userId=<id>
  router.patch("/mark-all-read", async (req, res) => {
    const { userId = null } = req.query;
    const q = userId ? { userId, isRead: false } : { isRead: false };
    const result = await Notification.updateMany(q, { $set: { isRead: true } });
    if (userId) io.to(`user:${userId}`).emit("mark-all-read");
    else io.emit("mark-all-read");
    res.json({ matched: result.matchedCount, modified: result.modifiedCount });
  });

  return router;
}
