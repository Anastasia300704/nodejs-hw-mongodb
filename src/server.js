import express from 'express';
import cors from 'cors';
import contactsRouter from './routes/contacts.js';

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json()); 
 app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    pino.info(`Server is running on port ${port}`);
  });
};

export default setupServer;
