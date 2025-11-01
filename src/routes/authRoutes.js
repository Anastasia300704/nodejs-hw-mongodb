import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from "../controllers/authController.js";

export const authRouter = express.Router();

const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

const loginUserSchema = { ...registerUserSchema };

authRouter.post("/register", celebrate(registerUserSchema), registerUser);
authRouter.post("/login", celebrate(loginUserSchema), loginUser);
authRouter.post("/refresh", refreshUserSession);
authRouter.post("/logout", logoutUser);
