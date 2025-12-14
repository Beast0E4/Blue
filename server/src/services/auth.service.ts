import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from 'jsonwebtoken'
import { User } from "../models/user.model.js";
import type { IUser } from "../models/user.model.js";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;


export interface TokenPayload {
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/* -------------------------------------------------------------------------- */
/*                                AUTH SERVICE                                */
/* -------------------------------------------------------------------------- */

export class AuthService {
  /* ---------------- JWT CONFIG ---------------- */

  private static readonly ACCESS_SECRET: Secret =
    process.env.JWT_ACCESS_SECRET ?? "access_secret";

  private static readonly REFRESH_SECRET: Secret =
    process.env.JWT_REFRESH_SECRET ?? "refresh_secret";

  private static readonly ACCESS_OPTIONS: SignOptions = {
    expiresIn: (process.env.JWT_ACCESS_EXPIRY ?? "15m") as JwtExpiresIn,
    };

    private static readonly REFRESH_OPTIONS: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRY ?? "7d") as JwtExpiresIn,
    };

  /* ---------------- TOKEN HELPERS ---------------- */

  static generateTokens(user: IUser): AuthTokens {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const accessToken = jwt.sign(
      payload,
      this.ACCESS_SECRET,
      this.ACCESS_OPTIONS
    );

    const refreshToken = jwt.sign(
      payload,
      this.REFRESH_SECRET,
      this.REFRESH_OPTIONS
    );

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.ACCESS_SECRET) as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.REFRESH_SECRET) as TokenPayload;
  }

  /* ---------------- AUTH OPERATIONS ---------------- */

  static async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ user: IUser; tokens: AuthTokens }> {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error("User already exists with this email or username");
    }

    const user = await User.create({ username, email, password });
    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  static async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; tokens: AuthTokens }> {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  static async refreshAccessToken(refreshToken: string): Promise<string> {
    const payload = this.verifyRefreshToken(refreshToken);

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new Error("User not found");
    }

    return jwt.sign(
      { userId: user._id.toString(), email: user.email },
      this.ACCESS_SECRET,
      this.ACCESS_OPTIONS
    );
  }

  static async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastSeen: new Date(),
    });
  }
}
