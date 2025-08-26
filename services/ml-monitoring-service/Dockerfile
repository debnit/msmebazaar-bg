# Multi-stage build for ml-monitoring-service
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
COPY services/ml-monitoring-service/ ./services/ml-monitoring-service/

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

# Build ml-monitoring-service
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/ml-monitoring-service/ ./services/ml-monitoring-service/
COPY tsconfig.json ./

# Generate Prisma client if prisma directory exists
RUN if [ -d "services/ml-monitoring-service/prisma" ]; then cd services/ml-monitoring-service && npx prisma generate; fi

# Build the service
RUN cd services/ml-monitoring-service && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 ml-monitoring-service

# Copy the built application
COPY --from=builder --chown=ml-monitoring-service:nodejs /app/services/ml-monitoring-service/dist ./dist
COPY --from=builder --chown=ml-monitoring-service:nodejs /app/services/ml-monitoring-service/package*.json ./
COPY --from=deps --chown=ml-monitoring-service:nodejs /app/node_modules ./node_modules

# Copy Prisma files if they exist
RUN if [ -d "/app/services/ml-monitoring-service/prisma" ]; then       cp -r /app/services/ml-monitoring-service/prisma ./prisma;     fi

USER ml-monitoring-service

EXPOSE 3015

ENV PORT 3015
ENV HOSTNAME "0.0.0.0"

# Run database migrations and start the service
CMD ["sh", "-c", "if [ -d './prisma' ]; then npx prisma migrate deploy; fi && node dist/index.js"]