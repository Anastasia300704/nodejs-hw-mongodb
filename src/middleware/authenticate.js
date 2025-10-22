import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createError(401, 'Not authorized'));
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const session = await Session.findOne({ userId: id, accessToken: token });
    if (!session) {
      return next(createError(401, 'Access token expired or invalid'));
    }

    
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
