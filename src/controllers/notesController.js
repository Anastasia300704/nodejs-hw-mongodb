import { Note } from "../models/note.js";

export const getNotes = async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const getNoteById = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Not found" });
  res.json(note);
};

export const deleteNote = async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) return res.status(404).json({ message: "Not found" });
  res.status(204).send();
};
