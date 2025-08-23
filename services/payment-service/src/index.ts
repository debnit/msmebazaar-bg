// PRODUCTION-GRADE SERVICE BOOTSTRAP
import express from "express";
import { createServer } from "http";
import paymentRoutes from "./routes/payment.routes";
import { logger } from "./utils/logger";
import { paymentEventProducer } from "./kafka/producer";
import { startConsumer, stopConsumer } from "./kafka/consumerRunner";
import prisma from "./db/prismaClient";
import helmet from "helmet";
import compression from "compression";


class PaymentService {
  private app: express.Application;
  private server: any;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request ID middleware
    this.app.use((req, res, next) => {
      req.headers['x-request-id'] = req.headers['x-request-id'] || 
        Math.random().toString(36).substring(7);
      next();
    });
  }

  private setupRoutes(): void {
    this.app.use("/payments", paymentRoutes);
    this.app.get("/health", this.healthCheck);
    this.app.get("/ready", this.readinessCheck);
  }

  private healthCheck = (req: express.Request, res: express.Response) => {
    res.status(200).json({
      status: "healthy",
      service: "payment-service",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  };

  private readinessCheck = async (req: express.Request, res: express.Response) => {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      
      res.status(200).json({
        status: "ready",
        checks: {
          database: "healthy",
          kafka: "healthy",
        },
      });
    } catch (error) {
      res.status(503).json({
        status: "not ready",
        error: error.message,
      });
    }
  };

  private setupErrorHandling(): void {
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled application error', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
      });

      res.status(500).json({
        success: false,
        error: "Internal server error",
        requestId: req.headers['x-request-id'],
      });
    });
  }

  async start(): Promise<void> {
    const PORT = process.env.SERVICE_PORT || 4004;
    
    try {
      // Initialize database connection
      await prisma.$connect();
      logger.info('Database connected successfully');

      // Initialize Kafka producer
      await paymentEventProducer.connect();
      logger.info('Kafka producer connected successfully');

      // Start Kafka consumer
      await startConsumer();
      logger.info('Kafka consumer started successfully');

      // Start HTTP server
      this.server = createServer(this.app);
      this.server.listen(PORT, () => {
        logger.info(`Payment service running on port ${PORT}`);
      });

      this.setupGracefulShutdown();
    } catch (error) {
      logger.error('Failed to start payment service', {
        error: error.message,
      });
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown`);

      if (this.server) {
        this.server.close(async () => {
          logger.info('HTTP server closed');
          
          // Close database connection
          await prisma.$disconnect();

          // Close Kafka consumer
          await stopConsumer();

          
          // Close Kafka connections
          await paymentEventProducer.disconnect();
          
          logger.info('Graceful shutdown completed');
          process.exit(0);
        });
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }
}

// Start the service
const paymentService = new PaymentService();
paymentService.start().catch((error) => {
  logger.fatal('Failed to start payment service', { error: error.message });
  process.exit(1);
});

export default paymentService;
