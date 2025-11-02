import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors as celebrateErrors } from 'celebrate';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import contactsRouter from './routes/contactsRouter.js';
import authRouter from "./routes/authRoutes.js";
import userRouter from './routes/userRoutes.js';
import { connectMongoDB } from './db/initMongoConnection.js';

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

   app.use('/notes', notesRouter);
  app.use('/contacts', contactsRouter);
app.use("/auth", authRouter);
app.use('/users', userRouter);

app.use(celebrateErrors());
  
  app.use(notFoundHandler);
app.use(errorHandler);

export const setupServer = async () => {
  await connectMongoDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
};