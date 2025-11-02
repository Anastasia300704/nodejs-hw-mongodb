import { setupServer } from './server.js';

const start = async () => {
  try {
    await setupServer();
  } catch (error) {
    console.error('Startup error:', error.message);
    process.exit(1);
  }
};

start();
