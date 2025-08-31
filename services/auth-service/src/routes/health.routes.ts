// services/auth-service/src/routes/health.routes.ts
import { Router, Request, Response } from 'express';
import { SessionService } from '../services/session.service';
import { getClientIP } from '../middlewares/ipExtractor';

const router = Router();

// Basic health check
router.get('/', (req: Request, res: Response) => {
  const clientIP = getClientIP(req);
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'auth-service',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    clientIP: clientIP
  });
});

// Detailed health check with database connectivity
router.get('/detailed', async (req: Request, res: Response) => {
  try {
    const clientIP = getClientIP(req);
    
    // Get session statistics
    const sessionStats = await SessionService.getSessionStats();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'auth-service',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      clientIP: clientIP,
      database: 'connected',
      sessions: sessionStats,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'auth-service',
      error: error instanceof Error ? error.message : 'Unknown error',
      clientIP: getClientIP(req)
    });
  }
});

// Session statistics endpoint
router.get('/sessions', async (req: Request, res: Response) => {
  try {
    const stats = await SessionService.getSessionStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      clientIP: getClientIP(req)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get session statistics',
      clientIP: getClientIP(req)
    });
  }
});

export default router;
