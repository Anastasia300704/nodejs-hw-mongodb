import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors as celebrateErrors } from 'celebrate';
import { initMongoConnection } from './db/initMongoConnection.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import contactsRouter from './routes/contactsRouter.js';
import authRouter from "./routes/authRoutes.js";
import userRouter from './routes/userRoutes.js';

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