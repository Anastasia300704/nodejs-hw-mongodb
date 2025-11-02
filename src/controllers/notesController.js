import createError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  const { page = 1, limit = 10, tag, q } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = { userId: req.user._id };
  if (tag) filter.tag = tag;

  let query = Note.find(filter);

  if (q) {
    query = Note.find({ $text: { $search: q }, ...filter });
  }

  const totalItems = await Note.countDocuments(filter && q ? { $text: { $search: q }, ...filter } : filter);

  const notes = await query.sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).exec();

  res.status(200).json({
    status: 200,
    message: 'Successfully found notes',
    data: notes,
    meta: {
      page: Number(page),
      limit: Number(limit),
      totalItems,
      totalPages: Math.ceil(totalItems / Number(limit)),
    },
  });
};

export const createNote = async (req, res, next) => {
  const payload = { ...req.body, userId: req.user._id };
  const note = await Note.create(payload);
  res.status(201).json({
    status: 201,
    message: 'Successfully created note',
    data: note,
  });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });
  if (!note) throw createError(404, 'Note not found');
  res.status(200).json({
    status: 200,
    message: `Successfully found note ${noteId}`,
    data: note,
  });
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const updated = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    { new: true }
  );
  if (!updated) throw createError(404, 'Note not found');
  res.status(200).json({
    status: 200,
    message: 'Successfully updated note',
    data: updated,
  });
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const deleted = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });
  if (!deleted) throw createError(404, 'Note not found');
  res.status(200).json({
    status: 200,
    message: 'Successfully deleted note',
    data: deleted,
  });
};

