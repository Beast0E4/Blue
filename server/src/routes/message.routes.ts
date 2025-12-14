import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getConversation,
  markMessagesAsRead,
  getUnreadCount,
  getAllUnreadCounts,
  getRecentConversations,
} from "../controllers/message.controller.js";

const router = Router();

// Get conversation between two users
router.get(
  "/conversation/:userId",
  authMiddleware,
  getConversation
);

// Mark messages as read
router.put(
  "/read/:senderId",
  authMiddleware,
  markMessagesAsRead
);

// Get unread count from specific user
router.get(
  "/unread/:fromUserId",
  authMiddleware,
  getUnreadCount
);

// Get all unread counts
router.get(
  "/unread",
  authMiddleware,
  getAllUnreadCounts
);

// Get recent conversations
router.get(
  "/conversations",
  authMiddleware,
  getRecentConversations
);

export const messageRouter = router;
