import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";

import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { createSession, setSessionCookies } from "../services/auth.js";
import { sendEmail } from "../utils/sendMail.js";

const { JWT_SECRET, FRONTEND_DOMAIN } = process.env;

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw createHttpError(400, "Email in use");

  const user = await User.create({ email, password });
  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.status(201).json(user);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, "Invalid credentials");

  const correct = await bcrypt.compare(password, user.password);
  if (!correct) throw createHttpError(401, "Invalid credentials");

  await Session.deleteMany({ userId: user._id });

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.status(200).json(user);
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) throw createHttpError(401, "Session not found");

  if (session.refreshTokenValidUntil < new Date())
    throw createHttpError(401, "Session token expired");

  await Session.deleteOne({ _id: sessionId });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.json({ message: "Session refreshed" });
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) await Session.deleteOne({ _id: sessionId });

  res.clearCookie("sessionId");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(204).end();
};


export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "Password reset email sent successfully",
      });
    }

    const token = jwt.sign(
      { sub: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const templatePath = path.join(
      process.cwd(),
      "src/templates/reset-password-email.html"
    );

    const template = await fs.readFile(templatePath, "utf-8");

    const compiledTemplate = handlebars.compile(template);

    const html = compiledTemplate({
      name: user.username,
      link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`,
    });

    await sendEmail({
      to: email,
      subject: "Reset password",
      html,
    });

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw createHttpError(401, "Invalid or expired token");
    }

    const user = await User.findOne({
      _id: payload.sub,
      email: payload.email,
    });

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};