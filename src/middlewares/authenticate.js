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

    if (!user) {
      return next(createError(401, 'Not authorized'));
    }

     req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
       console.error('Authenticate error:', err.message);
    return next(createError(401, 'Not authorized'));
  }
};
