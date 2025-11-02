import dotenv from 'dotenv';
import { setupServer } from './server.js';

dotenv.config();

const start = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Startup error:', error.message);
    process.exit(1);
  }
};

start();
