import request from 'supertest';
import app from '../index';
import { SessionUser } from '@shared/types/user';
import { UserRole } from '@shared/types/feature';

// Mock JWT middleware
jest.mock('@shared/auth', () => ({
  jwtMw: () => (req: any, res: any, next: any) => {
    req.user = mockUser;
    next();
  },
  getSessionUser: (req: any) => req.user
}));

// Mock role middleware
jest.mock('@shared/middleware/auth', () => ({
  requireRole: (...roles: string[]) => (req: any, res: any, next: any) => {
    if (roles.includes(req.user?.roles[0])) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  }
}));

const mockUser: SessionUser = {
  id: 'user-123',
  email: 'buyer@example.com',
  name: 'Test Buyer',
  isPro: false,
  roles: [UserRole.BUYER],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

const mockProUser: SessionUser = {
  ...mockUser,
  isPro: true,
  onboardedProAt: '2024-01-01T00:00:00Z'
};

describe('Buyer Service Integration Tests', () => {
  describe('GET /buyer/profile', () => {
    it('should return buyer profile', async () => {
      const response = await request(app)
        .get('/buyer/profile')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      // Temporarily remove user from request
      const originalJwtMw = require('@shared/auth').jwtMw;
      require('@shared/auth').jwtMw = () => (req: any, res: any, next: any) => {
        next();
      };

      const response = await request(app)
        .get('/buyer/profile');

      expect(response.status).toBe(401);

      // Restore original mock
      require('@shared/auth').jwtMw = originalJwtMw;
    });
  });

  describe('GET /buyer/search', () => {
    it('should perform basic search', async () => {
      const response = await request(app)
        .get('/buyer/search?query=technology&limit=10')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should require search query', async () => {
      const response = await request(app)
        .get('/buyer/search')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Search query is required');
    });
  });

  describe('POST /buyer/search/advanced', () => {
    it('should return upgrade required for non-Pro users', async () => {
      const response = await request(app)
        .post('/buyer/search/advanced')
        .set('Authorization', 'Bearer mock-token')
        .send({
          query: 'technology',
          filters: { category: ['tech'] }
        });

      expect(response.status).toBe(403);
      expect(response.body.data.upgradeRequired).toBe(true);
    });

    it('should require search query', async () => {
      const response = await request(app)
        .post('/buyer/search/advanced')
        .set('Authorization', 'Bearer mock-token')
        .send({
          filters: { category: ['tech'] }
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Search query is required');
    });
  });

  describe('POST /buyer/contact-seller', () => {
    it('should require seller ID and message', async () => {
      const response = await request(app)
        .post('/buyer/contact-seller')
        .set('Authorization', 'Bearer mock-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Seller ID and message are required');
    });

    it('should send message with valid data', async () => {
      const response = await request(app)
        .post('/buyer/contact-seller')
        .set('Authorization', 'Bearer mock-token')
        .send({
          sellerId: 'seller-123',
          message: 'Hello, I am interested in your listing'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /buyer/search/saved', () => {
    it('should return upgrade required for non-Pro users', async () => {
      const response = await request(app)
        .get('/buyer/search/saved')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(403);
      expect(response.body.data.upgradeRequired).toBe(true);
    });
  });

  describe('POST /buyer/search/save', () => {
    it('should require search name and query', async () => {
      const response = await request(app)
        .post('/buyer/search/save')
        .set('Authorization', 'Bearer mock-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Search name and query are required');
    });

    it('should return upgrade required for non-Pro users', async () => {
      const response = await request(app)
        .post('/buyer/search/save')
        .set('Authorization', 'Bearer mock-token')
        .send({
          name: 'Tech Search',
          query: 'technology'
        });

      expect(response.status).toBe(403);
      expect(response.body.data.upgradeRequired).toBe(true);
    });
  });

  describe('GET /buyer/analytics', () => {
    it('should return upgrade required for non-Pro users', async () => {
      const response = await request(app)
        .get('/buyer/analytics')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(403);
      expect(response.body.data.upgradeRequired).toBe(true);
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('buyer-service');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Route not found');
    });
  });
});
