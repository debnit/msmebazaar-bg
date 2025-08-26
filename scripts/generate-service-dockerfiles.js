#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesDir = path.join(__dirname, '../services');
const services = fs.readdirSync(servicesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Service port mapping
const servicePorts = {
  'auth-service': 3002,
  'loan-service': 3003,
  'payment-service': 3004,
  'user-profile-service': 3005,
  'recommendation-service': 3006,
  'valuation-service': 3007,
  'transaction-matching-service': 3008,
  'superadmin-service': 3009,
  'sellerservice': 3010,
  'search-matchmaking-service': 3011,
  'notification-service': 3012,
  'msme-service': 3013,
  'msme-listing-service': 3014,
  'ml-monitoring-service': 3015,
  'matchmaking-service': 3016,
  'exit-as-a-service': 3017,
  'compliance-service': 3018,
  'buyer-service': 3019,
  'admin-service': 3020,
  'agent-service': 3021
};

const dockerfileTemplate = (serviceName, port) => `# Multi-stage build for ${serviceName}
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy entire workspace structure for proper workspace dependency resolution
COPY shared/ ./shared/
COPY services/${serviceName}/ ./services/${serviceName}/

# Upgrade npm for workspace support
RUN npm install -g npm@latest

# Install dependencies with workspace support
RUN npm install --workspaces --omit=dev

# Build shared library
FROM base AS shared-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY shared/ ./shared/
COPY tsconfig.json ./
RUN cd shared && npm run build

# Build ${serviceName}
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/${serviceName}/ ./services/${serviceName}/
COPY tsconfig.json ./

# Generate Prisma client if prisma directory exists
RUN if [ -d "services/${serviceName}/prisma" ]; then cd services/${serviceName} && npx prisma generate; fi

# Build the service
RUN cd services/${serviceName} && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 ${serviceName}

# Copy the built application
COPY --from=builder --chown=${serviceName}:nodejs /app/services/${serviceName}/dist ./dist
COPY --from=builder --chown=${serviceName}:nodejs /app/services/${serviceName}/package*.json ./
COPY --from=deps --chown=${serviceName}:nodejs /app/node_modules ./node_modules

# Copy Prisma files if they exist
RUN if [ -d "/app/services/${serviceName}/prisma" ]; then \
      cp -r /app/services/${serviceName}/prisma ./prisma; \
    fi

USER ${serviceName}

EXPOSE ${port}

ENV PORT ${port}
ENV HOSTNAME "0.0.0.0"

# Run database migrations and start the service
CMD ["sh", "-c", "if [ -d './prisma' ]; then npx prisma migrate deploy; fi && node dist/index.js"]`;

// Generate Dockerfiles for each service
services.forEach(serviceName => {
  const servicePath = path.join(servicesDir, serviceName);
  const port = servicePorts[serviceName] || 3000;
  
  // Generate Dockerfile
  const dockerfilePath = path.join(servicePath, 'Dockerfile');
  const dockerfileContent = dockerfileTemplate(serviceName, port);
  
  fs.writeFileSync(dockerfilePath, dockerfileContent);
  console.log(`Generated Dockerfile for ${serviceName} (port: ${port})`);
});

console.log('Service Dockerfile generation completed!');
