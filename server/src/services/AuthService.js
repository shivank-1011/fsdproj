const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const { PrismaClient } = require("@prisma/client");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  /**
   * Registers a new user with email/password.
   * @returns {{ user, accessToken, refreshToken }}
   */
  async register({ email, password, name, role }) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: role || "USER" },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticates a user with email/password.
   * @returns {{ user, accessToken, refreshToken }}
   */
  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refreshes an access token given a valid refresh token.
   * @returns {{ accessToken }}
   */
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      const error = new Error("Refresh token required");
      error.statusCode = 401;
      throw error;
    }

    const user = await prisma.user.findFirst({ where: { refreshToken } });
    if (!user) {
      const error = new Error("Invalid refresh token");
      error.statusCode = 403;
      throw error;
    }

    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
        if (err) {
          const error = new Error("Invalid or expired refresh token");
          error.statusCode = 403;
          return reject(error);
        }
        const accessToken = generateAccessToken(user);
        resolve({ accessToken });
      });
    });
  }

  /**
   * Invalidates a user's refresh token (logout).
   */
  async logout(refreshToken) {
    if (refreshToken) {
      await prisma.user.updateMany({
        where: { refreshToken },
        data: { refreshToken: null },
      });
    }
  }

  /**
   * Fetches the currently authenticated user's profile.
   * @returns {{ user }}
   */
  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return { user };
  }

  /**
   * Authenticates or creates a user via Google OAuth.
   * @returns {{ user, accessToken, refreshToken }}
   */
  async googleLogin({ idToken, role }) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await prisma.user.create({
        data: { email, name, password: hashedPassword, role: role || "USER" },
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}

module.exports = AuthService;
