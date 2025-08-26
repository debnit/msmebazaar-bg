# Docker Setup for MSMEBazaar Platform

This document describes the Docker configuration and usage for the MSMEBazaar monorepo.

## Architecture Overview

The Docker setup uses a multi-stage build approach with the following components:

- **Shared Library**: Base image with common utilities and types
- **API Gateway**: Entry point for all API requests
- **Microservices**: Individual services for different business domains
- **Frontend**: Next.js application
- **Infrastructure**: Database, Redis, monitoring, and reverse proxy

## Dockerfile Structure

### 1. Shared Library (`shared/Dockerfile`)
```dockerfile
# Multi-stage build for Shared Library
FROM node:18-alpine AS base
# ... build stages for shared library
```

**Purpose**: Builds the shared TypeScript library that other services depend on.

### 2. API Gateway (`api-gateway/Dockerfile`)
```dockerfile
# Multi-stage build for API Gateway
FROM node:18-alpine AS base
# ... build stages including shared library
```

**Purpose**: Builds the API gateway with shared library integration.

### 3. Service Dockerfiles (`services/*/Dockerfile`)
```dockerfile
# Multi-stage build for [service-name]
FROM node:18-alpine AS base
# ... build stages including shared library and service-specific code
```

**Purpose**: Builds individual microservices with shared library integration.

### 4. Frontend (`frontend/Dockerfile`)
```dockerfile
# Multi-stage build for Next.js frontend
FROM node:18-alpine AS base
# ... build stages for Next.js application
```

**Purpose**: Builds the Next.js frontend application.

## Port Mapping

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js application |
| API Gateway | 3001 | API entry point |
| Auth Service | 3002 | Authentication service |
| Loan Service | 3003 | Loan management |
| Payment Service | 3004 | Payment processing |
| User Profile Service | 3005 | User profile management |
| Recommendation Service | 3006 | Recommendations |
| Valuation Service | 3007 | Asset valuation |
| Transaction Matching | 3008 | Transaction matching |
| Superadmin Service | 3009 | Super admin panel |
| Seller Service | 3010 | Seller management |
| Search Matchmaking | 3011 | Search and matching |
| Notification Service | 3012 | Notifications |
| MSME Service | 3013 | MSME management |
| MSME Listing Service | 3014 | MSME listings |
| ML Monitoring Service | 3015 | ML model monitoring |
| Matchmaking Service | 3016 | Matchmaking logic |
| Exit as a Service | 3017 | Exit services |
| Compliance Service | 3018 | Compliance management |
| Buyer Service | 3019 | Buyer management |
| Admin Service | 3020 | Admin panel |
| Agent Service | 3021 | Agent management |

## Getting Started

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (for local development)

### Environment Setup

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   ```bash
   # Database
   DATABASE_URL=postgresql://msmebazaar:password@postgres:5432/msmebazaar
   POSTGRES_PASSWORD=your_secure_password
   
   # JWT
   JWT_SECRET=your_jwt_secret
   
   # Redis
   REDIS_URL=redis://redis:6379
   
   # External services
   SENDGRID_API_KEY=your_sendgrid_key
   GRAFANA_PASSWORD=admin
   ```

### Building Images

#### Build all services
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build api-gateway
docker-compose build auth-service
docker-compose build frontend
```

#### Build with no cache
```bash
docker-compose build --no-cache
```

### Running Services

#### Start all services
```bash
docker-compose up -d
```

#### Start specific services
```bash
# Start only infrastructure
docker-compose up -d postgres redis

# Start API services
docker-compose up -d api-gateway auth-service

# Start frontend
docker-compose up -d frontend
```

#### Stop services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Development Workflow

#### 1. Local Development
```bash
# Start infrastructure only
docker-compose up -d postgres redis

# Run services locally
npm run dev
```

#### 2. Docker Development
```bash
# Build and start all services
docker-compose up --build

# View logs
docker-compose logs -f api-gateway
docker-compose logs -f auth-service
```

#### 3. Production Build
```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## Service-Specific Configuration

### API Gateway
- **Port**: 3001
- **Dependencies**: PostgreSQL, Redis
- **Environment**: JWT_SECRET, DATABASE_URL, REDIS_URL

### Auth Service
- **Port**: 3002
- **Dependencies**: PostgreSQL
- **Environment**: JWT_SECRET, DATABASE_URL
- **Features**: Prisma migrations, JWT authentication

### Frontend
- **Port**: 3000
- **Dependencies**: API Gateway
- **Environment**: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL
- **Features**: Next.js standalone output

## Monitoring and Logging

### Prometheus
- **Port**: 9090
- **Purpose**: Metrics collection
- **Configuration**: `./monitoring/prometheus.yml`

### Grafana
- **Port**: 3007
- **Purpose**: Metrics visualization
- **Configuration**: `./monitoring/grafana/`

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs -f api-gateway

# View logs with timestamps
docker-compose logs -f -t auth-service
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clean build cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### 2. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000

# Change ports in docker-compose.yml
ports:
  - "3001:3000"  # Map host port 3001 to container port 3000
```

#### 3. Database Connection Issues
```bash
# Check database status
docker-compose ps postgres

# View database logs
docker-compose logs postgres

# Connect to database
docker-compose exec postgres psql -U msmebazaar -d msmebazaar
```

#### 4. Service Dependencies
```bash
# Check service health
docker-compose ps

# Restart specific service
docker-compose restart auth-service

# Rebuild and restart
docker-compose up --build auth-service
```

### Performance Optimization

#### 1. Build Optimization
- Use multi-stage builds
- Leverage Docker layer caching
- Copy package files before source code

#### 2. Runtime Optimization
- Use Alpine Linux base images
- Run as non-root user
- Implement health checks
- Use proper resource limits

#### 3. Network Optimization
- Use bridge networks
- Implement service discovery
- Optimize inter-service communication

## Security Considerations

### 1. Image Security
- Use official base images
- Keep base images updated
- Scan images for vulnerabilities
- Run as non-root user

### 2. Network Security
- Use internal networks
- Expose only necessary ports
- Implement proper firewall rules
- Use secrets for sensitive data

### 3. Application Security
- Use environment variables for secrets
- Implement proper authentication
- Validate all inputs
- Use HTTPS in production

## Production Deployment

### 1. Environment Configuration
```bash
# Production environment file
cp .env.example .env.prod

# Configure production variables
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=very_secure_secret
```

### 2. Production Build
```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 3. Health Monitoring
```bash
# Check service health
docker-compose ps

# Monitor resource usage
docker stats

# View application metrics
curl http://localhost:9090/metrics
```

## Scripts and Automation

### Generate Dockerfiles
```bash
# Generate Dockerfiles for all services
npm run generate-dockerfiles
```

### Build Scripts
```bash
# Build shared library
npm run build:shared

# Build all services
npm run build

# Build Docker images
npm run docker:build
```

### Development Scripts
```bash
# Start development environment
npm run dev

# Start Docker environment
npm run docker:up

# View logs
npm run docker:logs
```

## Best Practices

1. **Always use multi-stage builds** for smaller production images
2. **Leverage Docker layer caching** by copying package files first
3. **Use health checks** for service dependencies
4. **Implement proper logging** for debugging
5. **Use environment variables** for configuration
6. **Run as non-root user** for security
7. **Keep base images updated** for security patches
8. **Use .dockerignore** to exclude unnecessary files
9. **Implement proper error handling** in startup scripts
10. **Monitor resource usage** in production
