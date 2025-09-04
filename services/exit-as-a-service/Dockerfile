# Multi-stage build for exit-as-a-service
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
COPY services/exit-as-a-service/ ./services/exit-as-a-service/

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

# Build exit-as-a-service
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/exit-as-a-service/ ./services/exit-as-a-service/
COPY tsconfig.json ./

# Generate Prisma client if schema exists
RUN if [ -d "services/exit-as-a-service/prisma" ]; then \
      cd services/exit-as-a-service && npx prisma generate; \
    fi

# Build the service
RUN cd services/exit-as-a-service && pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 exit-as-a-service

# Copy the built application
COPY --from=builder --chown=exit-as-a-service:nodejs /app/services/exit-as-a-service/dist ./dist
COPY --from=builder --chown=exit-as-a-service:nodejs /app/services/exit-as-a-service/package*.json ./
COPY --from=deps --chown=exit-as-a-service:nodejs /app/node_modules ./node_modules

# Copy Prisma schema if it exists
COPY --from=builder --chown=exit-as-a-service:nodejs /app/services/exit-as-a-service/prisma ./prisma

# Prune dev dependencies
RUN pnpm prune --prod

USER exit-as-a-service

EXPOSE 8011
ENV PORT=8011
ENV HOSTNAME=0.0.0.0

# Run database migrations and start the service
CMD ["sh", "-c", "if [ -d './prisma' ]; then npx prisma migrate deploy; fi && node dist/index.js"]
