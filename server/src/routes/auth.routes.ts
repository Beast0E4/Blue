import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  getCurrentUser,
  logout,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Refresh Token
router.post("/refresh", refreshToken);

// Get Current User
router.get("/me", authMiddleware, getCurrentUser);

// Logout
router.post("/logout", authMiddleware, logout);

export default router;
