// services/auth-service/src/routes/health.routes.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

interface HealthCheck {
  uptime: number;
  message: string;
  timestamp: number;
  services: {
    database: 'healthy' | 'unhealthy';
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

router.get('/health', async (req: Request, res: Response) => {
  const healthcheck: HealthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    services: {
      database: 'unhealthy',
      memory: {
        used: 0,
        total: 0,
        percentage: 0
      }
    }
  };

  try {
    // Database health check
    await prisma.$queryRaw`SELECT 1`;
    healthcheck.services.database = 'healthy';

    // Memory usage check
    const memUsage = process.memoryUsage();
    healthcheck.services.memory = {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
    };

    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = 'Service Degraded';
    res.status(503).json(healthcheck);
  }
});

export default router;
