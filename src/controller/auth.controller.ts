import { NextFunction, Request, Response } from "express";
import db from "../utils/db";
import asyncHandler from "../utils/asyncHandler";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { AuthRequest } from "../middleware/auth.middleware";
import { deleteResetToken, generateResetToken } from "../utils/resetToken";
import { sendResetTokenMail } from "../utils/nodemailer";
import { generateToken } from "../utils/jwt";

const cookieOptions = {
  httpOnly: true,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  var user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (user) return res.status(409).json({ error: "Email already exists." });

  user = await db.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
    },
  });

  const token = generateToken(user.id);

  res.cookie("token", token, cookieOptions);

  return res.status(201).json({
    message: "User registered successfully.",
    data: { ...user, token },
  });
});

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    var user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return res.status(401).json({ error: "Invalid credential." });

    const isPasswordMatched = await comparePassword(password, user.password);

    if (!isPasswordMatched)
      return res.status(401).json({ error: "Invalid credential." });

    const token = generateToken(user.id);

    res.cookie("token", token, cookieOptions);

    return res
      .status(200)
      .json({ messgae: "Login successfull.", data: { ...user, token } });
  }
);

export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    return res.status(200).json({
      message: "User information retrieved successfully.",
      data: req.user,
    });
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) return res.status(401).json({ error: "Invalid credential." });

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return res.status(401).json({ error: "Invalid credential." });

    const existingResetToken = await db.resetToken.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (existingResetToken) {
      await deleteResetToken(existingResetToken.id);
    }

    const resetToken = await generateResetToken(user.id);

    if (!resetToken)
      return res.status(500).json({ error: "Internal server error." });

    const link = `${process.env.BASE_URL}/auth/reset-password/${resetToken.token}`;

    await sendResetTokenMail(user.email, "Password reset", link);

    res
      .status(200)
      .json({ message: "Password reset link sent to your email account." });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetToken: token } = req.params;
    const { newPassword } = req.body;
    if (!token)
      return res.status(400).json({ error: "Invalid link or expired." });

    const resetToken = await db.resetToken.findUnique({
      where: {
        token,
      },
    });

    if (!resetToken || resetToken.expiresAt < new Date())
      return res.status(400).json({ error: "Invalid link or expired." });

    const user = await db.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: await hashPassword(newPassword),
      },
    });

    await deleteResetToken(resetToken.id);

    return res
      .status(200)
      .json({ message: "Password reset sucessfully.", data: user });
  }
);
