# Multi-stage build for matchmaking-service
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

# Copy workspace structure for dependency resolution
COPY shared/ ./shared/
COPY services/matchmaking-service/ ./services/matchmaking-service/

# Install pnpm
RUN npm install -g pnpm@latest

# Install all dependencies with workspace support
RUN pnpm install --frozen-lockfile --recursive

# Build shared library
FROM base AS shared-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY shared/ ./shared/
COPY tsconfig.json ./
RUN cd shared && pnpm run build

# Build matchmaking-service
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/matchmaking-service/ ./services/matchmaking-service/
COPY tsconfig.json ./

# Generate Prisma client if schema exists
RUN if [ -d "services/matchmaking-service/prisma" ]; then \
      cd services/matchmaking-service && npx prisma generate; \
    fi

# Build the service
RUN cd services/matchmaking-service && pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 matchmaking-service

# Copy built application
COPY --from=builder --chown=matchmaking-service:nodejs /app/services/matchmaking-service/dist ./dist
COPY --from=builder --chown=matchmaking-service:nodejs /app/services/matchmaking-service/package*.json ./
COPY --from=deps --chown=matchmaking-service:nodejs /app/node_modules ./node_modules

# Copy Prisma files if present
COPY --from=builder --chown=matchmaking-service:nodejs /app/services/matchmaking-service/prisma ./prisma

# Prune devDependencies
RUN pnpm prune --prod

USER matchmaking-service

EXPOSE 8007
ENV PORT=8007
ENV HOSTNAME=0.0.0.0

# Run database migrations and start service
CMD ["sh", "-c", "if [ -d './prisma' ]; then npx prisma migrate deploy; fi && node dist/index.js"]
