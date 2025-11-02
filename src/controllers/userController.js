import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';

export const updateUserAvatar = async (req, res) => {
  if (!req.file || !req.file.buffer) throw createHttpError(400, 'No file');

  const buffer = req.file.buffer;
  const result = await saveFileToCloudinary(buffer);

  if (!result || !result.secure_url) throw createHttpError(500, 'Failed to upload avatar');

  const userId = req.user._id; 
  const updated = await User.findByIdAndUpdate(userId, { avatar: result.secure_url }, { new: true });
  if (!updated) throw createHttpError(404, 'User not found');

  res.status(200).json({ url: updated.avatar });
};
