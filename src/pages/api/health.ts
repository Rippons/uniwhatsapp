import type { APIRoute } from 'astro';
import mongoose from 'mongoose';
import { whatsappNotificationQueue } from '@core/queue';
import { logger } from '@core/logger';

export const GET: APIRoute = async () => {
  const start = Date.now();

  // Verificar estado de MongoDB
  let dbStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';
  let dbError: string | undefined;

  try {
    const state = mongoose.connection.readyState;
    // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    if (state === 1) {
      dbStatus = 'connected';
    } else if (state === 2) {
      dbStatus = 'disconnected'; // conectando aún
    } else {
      dbStatus = 'disconnected';
    }
  } catch (error) {
    dbStatus = 'error';
    dbError = error instanceof Error ? error.message : 'Unknown error';
    logger.error('[Health] MongoDB check failed:', error);
  }

  const queueStatus = whatsappNotificationQueue.getStatus();
  const uptime = process.uptime();
  const responseTime = Date.now() - start;

  const healthy = dbStatus === 'connected';

  const body = {
    status: healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime) + 's',
    responseTime: responseTime + 'ms',
    services: {
      database: {
        status: dbStatus,
        ...(dbError ? { error: dbError } : {}),
      },
      queue: {
        status: 'ok',
        name: queueStatus.name,
        pending: queueStatus.pending,
        processing: queueStatus.processing,
      },
    },
  };

  return new Response(JSON.stringify(body), {
    status: healthy ? 200 : 503,
    headers: { 'Content-Type': 'application/json' },
  });
};
