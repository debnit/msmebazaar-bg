# MSMEBazaar Monorepo Setup

This document describes the refactored monorepo structure for the MSMEBazaar platform.

## Project Structure

```
msmebazaar-bg/
├── package.json              # Root package.json with workspace configuration
├── tsconfig.json             # Root TypeScript configuration
├── Dockerfile                # Root Dockerfile for building all components
├── .dockerignore             # Docker ignore file
├── docker-compose.yml        # Docker Compose configuration
├── shared/                   # Shared utilities and types
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
├── api-gateway/              # API Gateway service
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── src/
├── frontend/                 # Next.js frontend application
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── src/
├── services/                 # Microservices
│   ├── auth-service/
│   ├── loan-service/
│   ├── payment-service/
│   ├── user-profile-service/
│   ├── recommendation-service/
│   ├── valuation-service/
│   ├── transaction-matching-service/
│   ├── superadmin-service/
│   ├── sellerservice/
│   ├── search-matchmaking-service/
│   ├── notification-service/
│   ├── msme-service/
│   ├── msme-listing-service/
│   ├── ml-monitoring-service/
│   ├── matchmaking-service/
│   ├── exit-as-a-service/
│   ├── compliance-service/
│   ├── buyer-service/
│   ├── admin-service/
│   └── agent-service/
├── mobile/                   # Mobile application
├── scripts/                  # Build and utility scripts
└── docs/                     # Documentation
```

## Key Features

### 1. TypeScript Project References
- Root `tsconfig.json` with project references to all components
- Each component extends the root configuration
- Proper path mapping for shared dependencies
- Incremental builds with `tsc --build`

### 2. NPM Workspaces
- Centralized dependency management
- Shared dependencies across all packages
- Workspace-aware package resolution

### 3. Standardized Configuration
- Consistent TypeScript configuration across all services
- Standardized package.json structure
- Unified build and development scripts

### 4. Docker Multi-stage Builds
- Optimized Docker images for each component
- Shared dependency caching
- Production-ready images

## Getting Started

### Prerequisites
- Node.js 18+
- npm 8+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd msmebazaar-bg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate service configurations** (if needed)
   ```bash
   npm run generate-configs
   ```

4. **Build shared library**
   ```bash
   npm run build:shared
   ```

### Development

#### Start all services
```bash
npm run dev
```

#### Start specific components
```bash
# API Gateway only
npm run dev:gateway

# Frontend only
npm run dev:frontend

# Specific services
cd services/auth-service && npm run dev
```

#### Build all components
```bash
npm run build
```

#### Type checking
```bash
# Check all projects
npm run type-check

# Check specific project
npm run type-check:shared
npm run type-check:frontend
npm run type-check:gateway
npm run type-check:services
```

#### Testing
```bash
# Run all tests
npm run test

# Run specific tests
npm run test:shared
npm run test:frontend
npm run test:gateway
npm run test:services
```

#### Linting
```bash
# Lint all code
npm run lint

# Lint specific components
npm run lint:shared
npm run lint:frontend
npm run lint:gateway
npm run lint:services
```

#### Code formatting
```bash
# Format all code
npm run format

# Check formatting
npm run format:check
```

### Docker

#### Build all images
```bash
npm run docker:build
```

#### Start all services
```bash
npm run docker:up
```

#### Stop all services
```bash
npm run docker:down
```

#### View logs
```bash
npm run docker:logs
```

## Adding New Services

1. **Create service directory**
   ```bash
   mkdir services/new-service
   cd services/new-service
   ```

2. **Generate configuration files**
   ```bash
   npm run generate-configs
   ```

3. **Add to root tsconfig.json references**
   ```json
   {
     "references": [
       { "path": "./services/new-service" }
     ]
   }
   ```

4. **Update root package.json scripts** (if needed)

## Shared Library Usage

### Importing shared utilities
```typescript
// In any service or frontend
import { someUtility } from '@msmebazaar/shared';
import { SomeType } from '@msmebazaar/shared/types';
```

### Adding to shared library
1. Add your code to `shared/src/`
2. Export from `shared/src/index.ts`
3. Build shared library: `npm run build:shared`

## Configuration Files

### Root tsconfig.json
- Base configuration for all projects
- Project references for incremental builds
- Strict TypeScript settings

### Service tsconfig.json
- Extends root configuration
- Service-specific paths and settings
- References shared library

### Package.json Structure
- Consistent scripts across all packages
- Workspace dependencies
- Standardized dependency versions

## Best Practices

1. **Always build shared library first** when making changes
2. **Use workspace dependencies** for internal packages
3. **Run type checking** before committing
4. **Use consistent naming** for services and packages
5. **Keep shared library minimal** and focused
6. **Use Docker for production** builds

## Troubleshooting

### TypeScript Errors
- Ensure shared library is built: `npm run build:shared`
- Check project references in root tsconfig.json
- Verify path mappings in service tsconfig.json

### Build Errors
- Clean all builds: `npm run clean`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for circular dependencies

### Docker Issues
- Clean Docker cache: `docker system prune`
- Rebuild images: `npm run docker:build`
- Check Docker Compose configuration

## Contributing

1. Follow the established project structure
2. Use the provided scripts for common tasks
3. Ensure all tests pass before submitting
4. Update documentation for new features
5. Use consistent code formatting

