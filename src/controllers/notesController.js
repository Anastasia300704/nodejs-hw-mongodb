import createError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const skip = (Number(page) - 1) * Number(perPage);

    const filter = { userId: req.user._id };
    if (tag) filter.tag = tag;

    const queryFilter = search ? { $text: { $search: search }, ...filter } : filter;

    const [notes, totalNotes] = await Promise.all([
      Note.find(queryFilter).sort({ createdAt: -1 }).skip(skip).limit(Number(perPage)),
      Note.countDocuments(queryFilter),
    ]);

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages: Math.ceil(totalNotes / Number(perPage)),
      notes,
    });
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const payload = { ...req.body, userId: req.user._id };
    const note = await Note.create(payload);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) throw createError(404, 'Note not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const updated = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) throw createError(404, 'Note not found');
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const deleted = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });
    if (!deleted) throw createError(404, 'Note not found');
    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};
