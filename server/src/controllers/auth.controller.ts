import type { Request, Response } from "express";
import { authService } from "../services/user.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

/* ---------------- REGISTER ---------------- */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { user, tokens } = await authService.register(
      username,
      email,
      password
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      tokens,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

/* ---------------- LOGIN ---------------- */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const { user, tokens } = await authService.login(email, password);

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isOnline: user.isOnline,
      },
      tokens,
    });
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
};

/* ---------------- REFRESH TOKEN ---------------- */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ error: "Refresh token is required" });
    }

    const accessToken =
      await authService.refreshAccessToken(refreshToken);

    return res.json({ accessToken });
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
};

/* ---------------- LOGOUT ---------------- */
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    await authService.logout(req.user!.userId);
    return res.json({ message: "Logged out successfully" });
  } catch {
    return res.status(500).json({ error: "Logout failed" });
  }
};
