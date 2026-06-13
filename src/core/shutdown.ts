import { disconnectDatabase } from '@core/database';
import { logger } from '@core/logger';
import { whatsappNotificationQueue } from '@core/queue';

let isShuttingDown = false;

async function gracefulShutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info('[Shutdown] Received ' + signal + '. Starting graceful shutdown...');

  // Esperar a que la cola termine los jobs en curso (máx 10 segundos)
  const queueTimeout = 10_000;
  const queueStart = Date.now();

  if (whatsappNotificationQueue.isProcessing || whatsappNotificationQueue.pending > 0) {
    logger.info('[Shutdown] Waiting for queue to finish (' + whatsappNotificationQueue.pending + ' pending jobs)...');

    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        const elapsed = Date.now() - queueStart;
        const idle = !whatsappNotificationQueue.isProcessing && whatsappNotificationQueue.pending === 0;

        if (idle || elapsed >= queueTimeout) {
          clearInterval(interval);
          if (!idle) {
            logger.warn('[Shutdown] Queue timeout reached. ' + whatsappNotificationQueue.pending + ' jobs dropped.');
          }
          resolve();
        }
      }, 200);
    });
  }

  // Desconectar base de datos
  try {
    await disconnectDatabase();
    logger.info('[Shutdown] Database disconnected.');
  } catch (error) {
    logger.error('[Shutdown] Error disconnecting database:', error);
  }

  logger.info('[Shutdown] Graceful shutdown complete.');
  process.exit(0);
}

// Registrar señales del sistema operativo
export function registerShutdownHandlers(): void {
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('uncaughtException', (error) => {
    logger.error('[Shutdown] Uncaught exception:', error);
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('[Shutdown] Unhandled rejection:', reason);
    gracefulShutdown('unhandledRejection');
  });

  logger.info('[Shutdown] Shutdown handlers registered.');
}