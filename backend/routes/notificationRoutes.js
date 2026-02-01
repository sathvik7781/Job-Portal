const express = require("express");
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  getUnreadCount,
} = require("../controllers/notificationController");
const { authenticate } = require("../middleware/auth");
const { validateMongoId, validate } = require("../middleware/validator");

// All routes require authentication
router.use(authenticate);

router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", validateMongoId, validate, markAsRead);
router.delete("/read", deleteAllRead);
router.delete("/:id", validateMongoId, validate, deleteNotification);

module.exports = router;
