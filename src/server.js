import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors as celebrateErrors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRouter from './routes/notesRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(logger);
app.use(express.json());
app.use(cookieParser());

app.use(notesRouter);
app.use(authRouter);
app.use(userRouter);

app.use(notFoundHandler);

app.use(celebrateErrors());

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
