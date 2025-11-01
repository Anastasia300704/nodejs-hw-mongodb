import express from "express";
import { getNotes, createNote, getNoteById, deleteNote } from "../controllers/notesController.js";
import { createNoteSchema } from "../validations/notesValidation.js";
import { logger } from "../middleware/logger.js";
import validateBody from "../middleware/validateBody.js";

const router = express.Router();

router.get("/", logger, getNotes);
router.post("/", logger, validateBody(createNoteSchema), createNote);
router.get("/:id", logger, getNoteById);
router.delete("/:id", logger, deleteNote);

export default router;
