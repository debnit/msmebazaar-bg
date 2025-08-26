// services/auth-service/src/utils/gracefulShutdown.ts
import { Server } from 'http';
import { logger } from './logger';

export class GracefulShutdown {
  private server: Server;
  private isShuttingDown = false;

  constructor(server: Server) {
    this.server = server;
    this.setupSignalHandlers();
  }

  private setupSignalHandlers() {
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      this.shutdown('uncaughtException');
    });
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.shutdown('unhandledRejection');
    });
  }

  private async shutdown(signal: string) {
    if (this.isShuttingDown) return;
    
    this.isShuttingDown = true;
    logger.info(`Received ${signal}, starting graceful shutdown`);

    const shutdownTimeout = setTimeout(() => {
      logger.error('Forcing shutdown due to timeout');
      process.exit(1);
    }, 10000);

    try {
      // Stop accepting new requests
      this.server.close(async () => {
        logger.info('HTTP server closed');
        
        // Close database connections, cleanup resources
        await this.cleanup();
        
        clearTimeout(shutdownTimeout);
        logger.info('Graceful shutdown completed');
        process.exit(0);
      });
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }

  private async cleanup() {
    // Add cleanup logic here (close DB connections, etc.)
    logger.info('Cleaning up resources...');
  }
}
