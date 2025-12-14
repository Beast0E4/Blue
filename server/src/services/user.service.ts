import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export const authService = {
  /* ---------------- REGISTER ---------------- */
  async register(username: string, email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const tokens = generateTokens(user._id.toString());

    return { user, tokens };
  },

  /* ---------------- LOGIN ---------------- */
  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    user.isOnline = true;
    await user.save();

    const tokens = generateTokens(user._id.toString());

    return { user, tokens };
  },

  /* ---------------- REFRESH ACCESS TOKEN ---------------- */
  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as { userId: string };

      const user = await User.findById(payload.userId);
      if (!user) {
        throw new Error("User not found");
      }

      const accessToken = generateAccessToken(payload.userId);
      return accessToken;
    } catch {
      throw new Error("Invalid refresh token");
    }
  },

  /* ---------------- LOGOUT ---------------- */
  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastSeen: new Date(),
    });
  },
};

/* ---------------- TOKEN HELPERS ---------------- */

const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

const generateTokens = (userId: string) => ({
  accessToken: generateAccessToken(userId),
  refreshToken: jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  ),
});
