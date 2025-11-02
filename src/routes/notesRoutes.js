import express from 'express';
import { celebrate, Segments } from 'celebrate';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = express.Router();

// all routes protected
router.use(authenticate);

// GET /notes
router.get('/', celebrate({ [Segments.QUERY]: getAllNotesSchema }), getAllNotes);

// POST /notes
router.post('/', celebrate({ [Segments.BODY]: createNoteSchema }), createNote);

// GET /notes/:noteId
router.get('/:noteId', celebrate({ [Segments.PARAMS]: noteIdSchema }), getNoteById);

// PATCH /notes/:noteId
router.patch(
  '/:noteId',
  celebrate({ [Segments.PARAMS]: noteIdSchema, [Segments.BODY]: updateNoteSchema }),
  updateNote
);

// DELETE /notes/:noteId
router.delete('/:noteId', celebrate({ [Segments.PARAMS]: noteIdSchema }), deleteNote);

export default router;
