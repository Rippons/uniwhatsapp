import mongoose from 'mongoose';
import { getEnv } from '@core/config';
import { logger } from '@core/logger';

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) return;

  try {
    const { MONGODB_URI } = getEnv();
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info('MongoDB disconnected');
}
