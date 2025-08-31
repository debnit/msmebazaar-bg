import express, { Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import paymentRoutes from "./routes/payment.routes";
import { logger } from "./utils/logger";
import { paymentEventProducer } from "./kafka/producer";
import { startConsumer, stopConsumer } from "./kafka/consumerRunner";
import prisma from "./db/prismaClient";
import helmet from "helmet";
import compression from "compression";
import { PaymentError } from "./utils/errors";

class PaymentService {
  private app: express.Application;
  private server?: Server;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(compression() as unknown as express.RequestHandler); // TS-safe
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    this.app.use((req, res, next) => {
      req.headers['x-request-id'] = req.headers['x-request-id'] ||
        Math.random().toString(36).substring(2, 10);
      next();
    });
  }

  private setupRoutes(): void {
    this.app.use("/payments", paymentRoutes);
    this.app.get("/health", this.healthCheck);
    this.app.get("/ready", this.readinessCheck);
  }

  private healthCheck = (_req: Request, res: Response) => {
    res.status(200).json({
      status: "healthy",
      service: "payment-service",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  };

  private readinessCheck = async (_req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({
        status: "ready",
        checks: {
          database: "healthy",
          kafka: "healthy",
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(503).json({
        status: "not ready",
        error: message,
      });
    }
  };

  private setupErrorHandling(): void {
    this.app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorStack = err instanceof Error ? err.stack : undefined;

      logger.error(
        { error: errorMessage, stack: errorStack, path: req.path, method: req.method },
        "Unhandled application error"
      );

      const statusCode = err instanceof PaymentError ? err.statusCode : 500;
      const message = err instanceof PaymentError ? err.message : "Internal server error";

      res.status(statusCode).json({
        success: false,
        error: message,
        requestId: req.headers['x-request-id'],
      });
    });
  }

  async start(): Promise<void> {
    const PORT = Number(process.env.SERVICE_PORT) || 4004;

    try {
      await prisma.$connect();
      logger.info("Database connected successfully");

      await paymentEventProducer.connect();
      logger.info("Kafka producer connected successfully");

      await startConsumer();
      logger.info("Kafka consumer started successfully");

      this.server = createServer(this.app);
      this.server.listen(PORT, () => {
        logger.info(`Payment service running on port ${PORT}`);
      });

      this.setupGracefulShutdown();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.fatal({ error: message }, "Failed to start payment service");
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown`);

      try {
        if (this.server) {
          await new Promise<void>((resolve) => this.server!.close(() => resolve()));
          logger.info("HTTP server closed");
        }

        await prisma.$disconnect();
        await stopConsumer();
        await paymentEventProducer.disconnect();

        logger.info("Graceful shutdown completed");
        process.exit(0);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error({ error: message }, "Error during graceful shutdown");
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  }
}

const paymentService = new PaymentService();
paymentService.start().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  logger.fatal({ error: message }, "Failed to start payment service");
  process.exit(1);
});

export default paymentService;
