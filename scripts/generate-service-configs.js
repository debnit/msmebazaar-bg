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

const tsconfigTemplate = (serviceName) => `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "dist",
    "rootDir": ".",
    "baseUrl": "./src",
    "moduleResolution": "node",
    "noEmit": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "paths": {
      "@/*": ["./*"],
      "@shared/*": ["../../shared/src/*"]
    }
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ],
  "references": [
    { "path": "../../shared" }
  ]
}`;

const packageJsonTemplate = (serviceName) => `{
  "name": "${serviceName}",
  "version": "1.0.0",
  "description": "${serviceName} microservice for MSMEBazaar platform",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest --runInBand",
    "lint": "eslint 'src/**/*.{ts,tsx}'",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@msmebazaar/shared": "workspace:*",
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "pino": "^8.0.0",
    "zod": "^3.20.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.15",
    "@types/jest": "^29.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/node": "^18.0.0",
    "@types/supertest": "^2.0.12",
    "jest": "^29.0.0",
    "prisma": "^5.0.0",
    "supertest": "^6.3.0",
    "ts-jest": "^29.0.0",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^4.9.5"
  }
}`;

const dockerfileTemplate = (serviceName) => `# Multi-stage build for ${serviceName}
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
RUN cd services/${serviceName} && npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 ${serviceName}

COPY --from=builder /app/services/${serviceName}/dist ./dist
COPY --from=builder /app/services/${serviceName}/package*.json ./
COPY --from=deps /app/node_modules ./node_modules

USER ${serviceName}

EXPOSE 3000

CMD ["node", "dist/index.js"]`;

// Generate configurations for each service
services.forEach(serviceName => {
  const servicePath = path.join(servicesDir, serviceName);
  
  // Generate tsconfig.json
  const tsconfigPath = path.join(servicePath, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    fs.writeFileSync(tsconfigPath, tsconfigTemplate(serviceName));
    console.log(`Generated tsconfig.json for ${serviceName}`);
  }
  
  // Generate package.json if it doesn't exist
  const packageJsonPath = path.join(servicePath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    fs.writeFileSync(packageJsonPath, packageJsonTemplate(serviceName));
    console.log(`Generated package.json for ${serviceName}`);
  }
  
  // Generate Dockerfile
  const dockerfilePath = path.join(servicePath, 'Dockerfile');
  if (!fs.existsSync(dockerfilePath)) {
    fs.writeFileSync(dockerfilePath, dockerfileTemplate(serviceName));
    console.log(`Generated Dockerfile for ${serviceName}`);
  }
});

console.log('Service configuration generation completed!');

