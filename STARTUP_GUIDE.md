# MSMEBazaar Service Startup Guide

This guide helps you run the frontend, API gateway, and auth service independently in separate terminals.

## Prerequisites

1. Make sure you have Node.js installed (v18 or higher)
2. Make sure you have PostgreSQL running on port 5432
3. Make sure you have Redis running on port 6379
4. Install dependencies: `pnpm install` (from root directory)

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| API Gateway | 7000 | http://localhost:7000 |
| Auth Service | 8004 | http://localhost:8004 |

## Step-by-Step Startup

### Terminal 1: Start API Gateway
```bash
cd api-gateway
npm run dev
```
Expected output: `API Gateway running on port 7000`

### Terminal 2: Start Auth Service
```bash
cd services/auth-service
npm run dev
```
Expected output: `Auth service running on port 8004`

### Terminal 3: Start Frontend
```bash
cd frontend
npm run dev
```
Expected output: `Ready - started server on 0.0.0.0:3000`

## Environment Variables

### API Gateway (.env file in api-gateway directory)
```env
NODE_ENV=development
GATEWAY_PORT=7000
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=3000
```

### Auth Service (.env file in services/auth-service directory)
```env
NODE_ENV=development
PORT=8004
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/msmebazaar
REDIS_URL=redis://localhost:6379
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
```

## Testing the Setup

### 1. Test API Gateway Health
```bash
curl http://localhost:7000/health
```

### 2. Test Auth Service Health
```bash
curl http://localhost:8004/health
```

### 3. Test Registration through Gateway
```bash
curl -X POST http://localhost:7000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User"
  }'
```

### 4. Test Login through Gateway
```bash
curl -X POST http://localhost:7000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

## Debug Tool

Run the debug script to check all services:
```bash
node debug-ports.js
```

## Common Issues

### 1. Port Already in Use
If you get "port already in use" errors:
```bash
# Find process using the port
lsof -i :7000
lsof -i :8004
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### 2. Database Connection Issues
Make sure PostgreSQL is running:
```bash
# Start PostgreSQL (if using Docker)
docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=msmebazaar -p 5432:5432 postgres:14

# Or start locally if installed
sudo service postgresql start
```

### 3. Redis Connection Issues
Make sure Redis is running:
```bash
# Start Redis (if using Docker)
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Or start locally if installed
sudo service redis start
```

### 4. CORS Issues
If you see CORS errors in the browser console, make sure:
- Frontend is running on port 3000
- API Gateway CORS is configured for http://localhost:3000
- Auth Service CORS is configured for http://localhost:3000

## Service Dependencies

```
Frontend (3000) → API Gateway (7000) → Auth Service (8004)
```

The frontend makes requests to the API gateway, which then proxies them to the appropriate microservice.

## Logs to Watch

### API Gateway Logs
Look for:
- `API Gateway running on port 7000`
- `[Auth Proxy] Received: POST /auth/register`
- Any proxy errors

### Auth Service Logs
Look for:
- `Auth service running on port 8004`
- `User registered successfully`
- `User logged in successfully`
- Any database connection errors

### Frontend Logs
Look for:
- `Ready - started server on 0.0.0.0:3000`
- Any API request errors in the browser console

## Next Steps

Once all services are running correctly:
1. Open http://localhost:3000 in your browser
2. Try registering a new user
3. Try logging in with the registered user
4. Check that the API gateway is properly forwarding requests to the auth service
