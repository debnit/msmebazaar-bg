# Multi-stage build for agent-service
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
COPY services/agent-service/ ./services/agent-service/

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

# Build agent-service
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/agent-service/ ./services/agent-service/
COPY tsconfig.json ./

# Generate Prisma client if prisma directory exists
RUN if [ -d "services/agent-service/prisma" ]; then cd services/agent-service && npx prisma generate; fi

# Build the service
RUN cd services/agent-service && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 agent-service

# Copy the built application
COPY --from=builder --chown=agent-service:nodejs /app/services/agent-service/dist ./dist
COPY --from=builder --chown=agent-service:nodejs /app/services/agent-service/package*.json ./
COPY --from=deps --chown=agent-service:nodejs /app/node_modules ./node_modules

# Copy Prisma files if they exist
RUN if [ -d "/app/services/agent-service/prisma" ]; then       cp -r /app/services/agent-service/prisma ./prisma;     fi

USER agent-service

EXPOSE 3021

ENV PORT 3021
ENV HOSTNAME "0.0.0.0"

# Run database migrations and start the service
CMD ["sh", "-c", "if [ -d './prisma' ]; then npx prisma migrate deploy; fi && node dist/index.js"]