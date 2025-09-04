# Multi-stage build for loan-service
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

# Copy workspace structure
COPY shared/ ./shared/
COPY services/loan-service/ ./services/loan-service/

# Install pnpm
RUN npm install -g pnpm@latest

# Install dependencies with workspace support
RUN pnpm install --frozen-lockfile --recursive

# Build shared library
FROM base AS shared-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY shared/ ./shared/
COPY tsconfig.json ./
RUN cd shared && pnpm run build

# Build loan-service
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/loan-service/ ./services/loan-service/
COPY tsconfig.json ./

# Generate Prisma client if schema exists
RUN if [ -d "services/loan-service/prisma" ]; then \
      cd services/loan-service && npx prisma generate; \
    fi

# Build the service
RUN cd services/loan-service && pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 loan-service

# Copy built application
COPY --from=builder --chown=loan-service:nodejs /app/services/loan-service/dist ./dist
COPY --from=builder --chown=loan-service:nodejs /app/services/loan-service/package*.json ./
COPY --from=deps --chown=loan-service:nodejs /app/node_modules ./node_modules

# Copy Prisma files if present
COPY --from=builder --chown=loan-service:nodejs /app/services/loan-service/prisma ./prisma

# Prune devDependencies
RUN pnpm prune --prod

USER loan-service

EXPOSE 8028
ENV PORT=8028
ENV HOSTNAME=0.0.0.0

# Run database migrations and start service
CMD ["sh", "-c", "if [ -d './prisma' ]; then npx prisma migrate deploy; fi && node dist/index.js"]
