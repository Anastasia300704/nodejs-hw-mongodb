import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createError(401, 'Not authorized'));
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      return next(createError(401, 'Not authorized'));
    }

    req.user = user;
    next();
  } catch {
    next(createError(401, 'Not authorized'));
  }
};
