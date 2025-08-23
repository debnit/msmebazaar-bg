// PRODUCTION-ENHANCED PRISMA CLIENT
import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
    errorFormat: 'pretty',
  });

// Enhanced logging for production
prisma.$on('query', (e) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Database query executed', {
      query: e.query,
      params: e.params,
      duration: e.duration,
    });
  }
});

prisma.$on('error', (e) => {
  logger.error('Database error occurred', {
    target: e.target,
    message: e.message,
  });
});

// Connection health check
prisma.$on('beforeExit', async () => {
  logger.info('Prisma client disconnecting...');
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
