import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../auth/auth.middleware';
import { User } from '../auth/user.model';

const router = Router();

// Search users
router.get('/users/search', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    const currentUserId = req.user?.userId;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    })
      .select('username email isOnline lastSeen')
      .limit(20);

    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Search failed' });
  }
});

// Get all users (excluding current user)
router.get('/users', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.userId;

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('username email isOnline lastSeen')
      .limit(50);

    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/users/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('username email isOnline lastSeen');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch user' });
  }
});

export const chatRouter = router;