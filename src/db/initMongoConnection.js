import mongoose from 'mongoose';
import getEnvVar from '../utils/getEnvVar.js';

const initMongoConnection = async () => {
  const mongoUser = getEnvVar('MONGODB_USER');
  const mongoPassword = getEnvVar('MONGODB_PASSWORD');
  const mongoURL = getEnvVar('MONGODB_URL');
  const mongoDbName = getEnvVar('MONGODB_DB');

  try {
    await mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@${mongoURL}/${mongoDbName}?retryWrites=true&w=majority`);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

export default initMongoConnection;

