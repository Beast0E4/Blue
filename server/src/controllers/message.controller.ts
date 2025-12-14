import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { MessageService } from "../services/message.service.js";

// Get conversation between two users
export const getConversation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const currentUserId = req.user!.userId;
    const { userId } = req.params;

    if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const messages = await MessageService.getConversation(
      currentUserId,
      userId,
      limit,
      skip
    );

    res.json({ messages });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch conversation" });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const receiverId = req.user!.userId;
    const { senderId } = req.params;

    if (!senderId) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }

    await MessageService.markMessagesAsRead(receiverId, senderId);

    res.json({ message: "Messages marked as read" });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to mark messages as read" });
  }
};

// Get unread count from specific user
export const getUnreadCount = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { fromUserId } = req.params;

    if (!fromUserId) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }

    const count = await MessageService.getUnreadCount(userId, fromUserId);

    res.json({ count });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch unread count" });
  }
};

// Get all unread counts
export const getAllUnreadCounts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const counts = await MessageService.getAllUnreadCounts(userId);

    res.json({ counts });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch unread counts" });
  }
};

// Get recent conversations
export const getRecentConversations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const conversations = await MessageService.getRecentConversations(userId);

    res.json({ conversations });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch conversations" });
  }
};
