# Multi-stage build for auth-service
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
COPY services/auth-service/ ./services/auth-service/

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

# Build auth-service
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/auth-service/ ./services/auth-service/
COPY tsconfig.json ./

# Generate Prisma client if prisma directory exists
RUN if [ -d "services/auth-service/prisma" ]; then cd services/auth-service && npx prisma generate; fi

# Build the service
RUN cd services/auth-service && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 auth-service

# Copy the built application
COPY --from=builder --chown=auth-service:nodejs /app/services/auth-service/dist ./dist
COPY --from=builder --chown=auth-service:nodejs /app/services/auth-service/package*.json ./
COPY --from=deps --chown=auth-service:nodejs /app/node_modules ./node_modules

# Copy Prisma files if they exist
RUN if [ -d "/app/services/auth-service/prisma" ]; then       cp -r /app/services/auth-service/prisma ./prisma;     fi

USER auth-service

EXPOSE 3002

ENV PORT 3002
ENV HOSTNAME "0.0.0.0"

# Run database migrations and start the service
CMD ["sh", "-c", "if [ -d './prisma' ]; then npx prisma migrate deploy; fi && node dist/index.js"]