# Multi-stage build for notification-service
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@latest

# Copy root workspace files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

# Copy shared workspace
COPY shared ./shared

# Copy only service package.json
COPY services/notification-service/package.json ./services/notification-service/

# Install only notification-service dependencies
WORKDIR /app/services/notification-service
RUN pnpm install --frozen-lockfile --filter ./...

# Build shared library
FROM base AS shared-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY shared ./shared
COPY tsconfig.json ./
RUN cd shared && pnpm run build

# Build notification-service
FROM base AS builder
WORKDIR /app/services/notification-service
COPY --from=deps /app/node_modules ../../node_modules
COPY --from=shared-builder /app/shared/dist ../../shared/dist
COPY . .
RUN if [ -d "prisma" ]; then npx prisma generate; fi
RUN pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 notification-service

# Copy built app
COPY --from=builder --chown=notification-service:nodejs /app/services/notification-service/dist ./dist
COPY --from=builder --chown=notification-service:nodejs /app/services/notification-service/package*.json ./
COPY --from=deps --chown=notification-service:nodejs /app/node_modules ./node_modules

# Copy prisma if exists
COPY --from=builder --chown=notification-service:nodejs /app/services/notification-service/prisma ./prisma

USER notification-service

EXPOSE 8008
ENV PORT=8008
ENV HOSTNAME=0.0.0.0

# Run migrations and start service
CMD ["sh", "-c", "if [ -d './prisma' ]; then npx prisma migrate deploy; fi && node dist/index.js"]
