import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '30d';
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const createAccessToken = (user) =>
  jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

const createRefreshToken = (user) =>
  jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

export const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw createError(409, 'Email in use');
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
  });
  return user;
};

export const login = async ({ email, password }, res) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Email or password is wrong');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw createError(401, 'Email or password is wrong');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  const accessValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  const refreshValidUntil = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: accessValidUntil,
    refreshTokenValidUntil: refreshValidUntil,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });

  return { accessToken };
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.cookies || {};
  if (!refreshToken) {
    throw createError(401, 'Refresh token missing');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (err) {
    throw createError(401, 'Invalid refresh token');
  }

  const session = await Session.findOne({ userId: payload.id, refreshToken });
  if (!session) throw createError(401, 'Session not found');

  await Session.deleteMany({ userId: payload.id });

  const user = await User.findById(payload.id);
  if (!user) throw createError(401, 'User not found');

  const accessToken = createAccessToken(user);
  const newRefreshToken = createRefreshToken(user);

  const accessValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshValidUntil = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: accessValidUntil,
    refreshTokenValidUntil: refreshValidUntil,
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });

  return { accessToken };
};

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies || {};
  if (!refreshToken) {
    res.clearCookie('refreshToken');
    return;
  }

  await Session.findOneAndDelete({ refreshToken });

  res.clearCookie('refreshToken');
};
