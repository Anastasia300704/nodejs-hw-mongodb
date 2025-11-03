import { Joi } from "celebrate";

export const getAllNotesSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  perPage: Joi.number().integer().min(1).optional(),
  tag: Joi.string().optional(),
  search: Joi.string().optional(),
});

export const noteIdSchema = Joi.object({
  noteId: Joi.string().hex().length(24).required(),
});

export const createNoteSchema = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().allow('').optional(),
  tag: Joi.string().optional(),
});

export const updateNoteSchema = Joi.object({
  title: Joi.string().min(1).optional(),
  content: Joi.string().allow('').optional(),
  tag: Joi.string().optional(),
});
